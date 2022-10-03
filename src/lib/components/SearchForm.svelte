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

  /*
  We if we click on the options list, prevent blur because the options list belongs to the input.
  */
  function onPointerDown() {
    if (hasFocus) {
      blurPrevented = true
      setTimeout(() => {
        blurPrevented = false
      }, 0)
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

  function onMouseOver(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (target && target.getAttribute('role') === 'option') {
      selectedOption = options.find(
        (option) => option.id === target.id
      )
    }
  }

  function onClick() {
    if (selectedOption) {
      goto(`/${$locale}/post/${selectedOption.slug}`)
    }
  }
</script>

<form action={`/${$locale}/search`} method="get" role="search">
  <label for={inputId}>{$LL.searchForm.inputLabel()}</label>
  <div class="inputContainer">
    <input
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
        on:pointerdown={onPointerDown}
        on:mouseover={onMouseOver}
        on:click={onClick}
      >
        {#await response}
          {$LL.searchForm.loading()}
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
            {$LL.searchForm.empty({query: value})}
          {/each}
        {/await}
      </ul>
    {/if}
  </div>
  <button
    type="submit"
    aria-label={$LL.searchForm.buttonLabel()}
  >
    <svg
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style="forced-color-adjust: auto"
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

  button {
    background-color: field;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }

  [role='listbox'] {
    background: var(--color-background);
    left: 0;
    top: 100%;
    position: absolute;
    z-index: 1;
  }

  [role='option'] {
    cursor: pointer;
    display: block;
  }

  [aria-selected='true'] {
    background: cornflowerblue;
  }
</style>
