<!--Loosely based off of the WAI ARIA Authoring Practices Guide Editable Combobox With List Autocomplete: https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-autocomplete-list.html -->
<script lang="ts">
  import icons from 'bootstrap-icons/bootstrap-icons.svg'
  import {nextUniqueId} from '$lib/utils/uniqueId'
  import {
    fetchPostsWithQuery,
    type PostQueryStub
  } from '$lib/sanity'
  import {goto} from '$app/navigation'

  export let locale: string

  const inputId = nextUniqueId()
  const listboxId = nextUniqueId()

  let inputElement: HTMLInputElement
  let value = ''
  let hasFocus = false
  let blurPrevented = false
  let selectedOption: PostQueryStub | undefined
  let options: PostQueryStub[] = []
  let response: Promise<PostQueryStub[]> = Promise.resolve([])

  $: {
    if (locale && value.length > 0) {
      response = fetchPostsWithQuery({locale, query: value})
    }
  }

  $: {
    response.then((resolved) => {
      options = resolved
    })
  }

  function clamp(min: number, max: number, n: number) {
    return Math.max(min, Math.min(max, n))
  }

  function isPrintableCharacter(string: string) {
    return string.length === 1 && string.match(/\S| /)
  }

  function nextOption(
    current: PostQueryStub | undefined,
    array: PostQueryStub[]
  ) {
    const index = array.findIndex(({id}) => id === current?.id)
    return array[clamp(0, array.length - 1, index + 1)]
  }

  function prevOption(
    current: PostQueryStub | undefined,
    array: PostQueryStub[]
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

  function onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey || event.shiftKey) {
      return
    }
    switch (event.key) {
      case 'Enter':
        if (locale && selectedOption) {
          goto(`/${locale}/post/${selectedOption.slug}`)
        }
        event.stopPropagation()
        event.preventDefault()
        break
      case 'Down':
      case 'ArrowDown':
        selectedOption = nextOption(selectedOption, options)
        event.stopPropagation()
        event.preventDefault()
        break
      case 'Up':
      case 'ArrowUp':
        selectedOption = prevOption(selectedOption, options)
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
    if (locale && selectedOption) {
      goto(`/${locale}/post/${selectedOption.slug}`)
    }
  }
</script>

<form
  action={locale ? `/${locale}/search` : '/search'}
  method="get"
  role="search"
>
  <div class="inputContainer">
    <label for={inputId}>Search</label>
    <input
      id={inputId}
      name="search"
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
    <button type="submit" aria-label="Submit Search">
      <svg
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        style="forced-color-adjust: auto"
      >
        <use xlink:href={`${icons}#search`} />
      </svg>
    </button>
  </div>
  {#if hasFocus}
    <!-- I shouldn't have to do this. We already have 'aria-controls' attribute on the input... -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <ul
      id={listboxId}
      role="listbox"
      aria-label="States"
      on:pointerdown={onPointerDown}
      on:mouseover={onMouseOver}
      on:click={onClick}
    >
      {#await response}
        Loading...
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
        {/each}
      {/await}
    </ul>
  {/if}
</form>

<style>
  form {
    position: relative;
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
