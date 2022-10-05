<!--Loosely based off of the WAI ARIA Authoring Practices Guide Editable Combobox With List Autocomplete: https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-autocomplete-list.html -->
<script lang="ts" context="module">
  import {client} from '$lib/sanity'
  import groq from 'groq'

  interface PostStub {
    title: string
    slug: string
    id: string
  }

  async function fetchPostStubs(params: {
    locale: string
    query: string
  }): Promise<PostStub[]> {
    return client.fetch(
      groq`
      *[_type == "post"]
      | score(title[$locale] match $query)
      | order(_score desc)
      [_score > 0]
      {
        "title": title[$locale],
        "slug": slug.current,
        "id": _id
      }
      [0..9]
    `,
      params
    )
  }

  function clamp(min: number, max: number, n: number) {
    return Math.max(min, Math.min(max, n))
  }

  function isPrintableCharacter(string: string) {
    return string.length === 1 && string.match(/\S| /)
  }

  function nextOption(
    current: PostStub | undefined,
    array: PostStub[]
  ) {
    const index = array.findIndex(({id}) => id === current?.id)
    return array[clamp(0, array.length - 1, index + 1)]
  }

  function prevOption(
    current: PostStub | undefined,
    array: PostStub[]
  ) {
    const index = array.findIndex(({id}) => id === current?.id)
    return array[
      clamp(
        0,
        array.length - 1,
        index < 0 ? Infinity : index - 1
      )
    ]
  }

  function setInputCaretToStart(element: HTMLInputElement) {
    element.selectionStart = element.selectionEnd = 0
  }

  function setInputCaretToEnd(element: HTMLInputElement) {
    element.selectionStart = element.selectionEnd =
      element.value.length
  }
</script>

<script lang="ts">
  import uiClasses from '$lib/ui.module.css'
  import icons from 'bootstrap-icons/bootstrap-icons.svg'
  import {nextUniqueId} from '$lib/utils/uniqueId'
  import {goto} from '$app/navigation'
  import {locale, LL} from '$i18n/i18n-svelte'

  const inputId = nextUniqueId()
  const listboxId = nextUniqueId()

  let inputElement: HTMLInputElement
  let value = ''
  let hasFocus = false
  let blurPrevented = false
  let selectedOption: PostStub | undefined
  let options: PostStub[] = []
  let response: Promise<PostStub[]> = Promise.resolve([])

  $: {
    if (value.length > 0) {
      response = fetchPostStubs({
        locale: $locale,
        query: value
      })
      response.then((resolved) => {
        options = resolved
      })
    } else {
      response = Promise.resolve([])
      options = []
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey || event.shiftKey) {
      return
    }
    switch (event.key) {
      case 'Enter':
        if (selectedOption) {
          event.stopPropagation()
          event.preventDefault()
          goto(`/${$locale}/post/${selectedOption.slug}`)
        }
        break
      case 'Down':
      case 'ArrowDown':
        selectedOption = nextOption(selectedOption, options)
        event.stopPropagation()
        event.preventDefault()
        break
      case 'Up':
      case 'ArrowUp':
        if (selectedOption === options[0]) {
          selectedOption = undefined
        } else if (selectedOption) {
          selectedOption = prevOption(selectedOption, options)
        }
        event.stopPropagation()
        event.preventDefault()
        break
      case 'Esc':
      case 'Escape':
        selectedOption = undefined
        event.stopPropagation()
        event.preventDefault()
        break
      case 'Home':
        setInputCaretToStart(inputElement)
        event.stopPropagation()
        event.preventDefault()
        break
      case 'End':
        setInputCaretToEnd(inputElement)
        event.stopPropagation()
        event.preventDefault()
        break
      default:
        break
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case 'Esc':
      case 'Escape':
        break
      case 'Backspace':
        selectedOption = undefined
        break
      case 'Left':
      case 'ArrowLeft':
      case 'Right':
      case 'ArrowRight':
      case 'Home':
      case 'End':
        selectedOption = undefined
        event.stopPropagation()
        event.preventDefault()
        break
      default:
        if (isPrintableCharacter(event.key)) {
          selectedOption = undefined
        }
        break
    }
  }

  function onFocus() {
    hasFocus = true
  }

  function onBlur() {
    if (blurPrevented) {
      inputElement?.focus()
    } else {
      hasFocus = false
    }
  }

  function onPointerDown() {
    selectedOption = undefined
  }

  /*
  We if we click on the options list, prevent blur because the options list belongs to the input.
  */
  function onListboxPointerDown(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (target && target.getAttribute('role') === 'option') {
      selectedOption = options.find(
        (option) => option.id === target.id
      )
    }

    if (hasFocus) {
      blurPrevented = true
      setTimeout(() => {
        blurPrevented = false
      }, 0)
    }
  }

  function onListboxClick() {
    if (selectedOption) {
      goto(`/${$locale}/post/${selectedOption.slug}`)
    }
  }
</script>

<form action={`/${$locale}/search`} method="get" role="search">
  <label for={inputId}>{$LL.searchForm.inputLabel()}:</label>
  <div class="inputContainer">
    <input
      class={uiClasses.input}
      class:hasFocus={hasFocus && !selectedOption}
      id={inputId}
      name="query"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      aria-expanded={options.length > 0 ? 'true' : 'false'}
      aria-controls={listboxId}
      bind:value
      bind:this={inputElement}
      on:pointerdown={onPointerDown}
      on:keydown={onKeyDown}
      on:keyup={onKeyUp}
      on:focus={onFocus}
      on:blur={onBlur}
    />
    {#if hasFocus && value.length > 0}
      <!-- I shouldn't have to use svelte-ignore here. We already have 'aria-controls' attribute on the input... -->
      <!-- svelte-ignore a11y-mouse-events-have-key-events -->
      <ul
        id={listboxId}
        role="listbox"
        aria-label={$LL.searchForm.suggestionsLabel()}
        on:pointerdown={onListboxPointerDown}
        on:click={onListboxClick}
      >
        {#await response}
          <div class="message">
            {$LL.searchForm.loading()}
          </div>
        {:then options}
          {#each options as option}
            <li
              id={option.id}
              role="option"
              aria-selected={option.id === selectedOption?.id
                ? 'true'
                : 'false'}
            >
              <!-- No anchor here because SvelteKit blocks the main thread on anchor mouseenter events, causing jank. -->
              {option.title}
            </li>
          {:else}
            <div class="message">
              {$LL.searchForm.empty({query: value})}
            </div>
          {/each}
        {/await}
      </ul>
    {/if}
  </div>
  <button
    class={uiClasses.iconButton}
    type="submit"
    aria-label={$LL.searchForm.buttonLabel()}
  >
    <svg
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <use xlink:href={`${icons}#search`} />
    </svg>
  </button>
</form>

<style>
  form {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-minus-1);
  }

  .inputContainer {
    position: relative;
  }

  input {
    width: 25ch;
  }

  input:focus {
    outline: none;
  }

  input.hasFocus {
    outline: solid 2px var(--color-focus);
  }

  button {
    background-color: var(--color-field);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
  }

  [role='listbox'] {
    background: var(--color-field);
    color: var(--color-text);
    border-radius: var(--border-radius-small);
    z-index: 1;
    position: absolute;
    right: 0;
    top: calc(100% + 0.5rem);
    min-width: 100%;
    max-width: 50ch;
    width: max-content;
  }

  [role='option'] {
    cursor: pointer;
    display: block;
    border-radius: var(--border-radius-small);
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .message,
  [role='option'] {
    min-height: 1.5rem;
    padding-inline: 0.5rem;
  }

  .message {
    color: var(--color-faded-text);
  }

  [aria-selected='true'] {
    outline: solid 2px var(--color-focus);
  }
</style>
