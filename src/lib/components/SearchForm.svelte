<script>
  import icons from 'bootstrap-icons/bootstrap-icons.svg'
  import {nextUniqueId} from '$lib/utils/uniqueId'
  import {fetchPosts} from '$lib/sanity'

  let inputId = nextUniqueId()
  let listboxId = nextUniqueId()
  let value = ''
  let options = []
  let selectedId = null
  let isExpanded = false
  let response = Promise.resolve([])

  $: {
    if (value.length > 0) {
      response = fetchPosts({locale: 'en', query: value})
    }
  }
</script>

<div class="root">
  <div class="inputContainer">
    <label for={inputId}>Search</label>
    <input
      id={inputId}
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={isExpanded ? 'true' : 'false'}
      aria-controls={listboxId}
      bind:value
    />
    <button
      tabindex="-1"
      aria-label="Submit Search"
      aria-expanded={isExpanded ? 'true' : 'false'}
      aria-controls={listboxId}
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
  </div>
  <ul id={listboxId} role="listbox" aria-label="States">
    {#await response}
      Loading...
    {:then options}
      {#each options as option}
        <li
          id={option.id}
          role="option"
          aria-selected={selectedId === option.id
            ? 'true'
            : 'false'}
        >
          {option.title}
        </li>
      {/each}
    {/await}
  </ul>
</div>

<style>
  svg {
    width: 1rem;
    height: 1rem;
  }
</style>
