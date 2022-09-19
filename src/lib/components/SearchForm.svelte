<script>
  import icons from 'bootstrap-icons/bootstrap-icons.svg'
  import {nextUniqueId} from '$lib/utils/uniqueId'
  console.log(icons)

  let inputId = nextUniqueId()
  let listboxId = nextUniqueId()
  let options = []
  let selectedId = null
  let isExpanded = false
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
    {#each options as option}
      <li
        id={option.id}
        role="option"
        aria-selected={selectedId === option.id
          ? 'true'
          : 'false'}
      >
        {option.label}
      </li>
    {/each}
  </ul>
</div>

<style>
  svg {
    width: 1rem;
    height: 1rem;
  }
</style>
