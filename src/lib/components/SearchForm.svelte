<script>
  import {nextUniqueId} from '$lib/utils/uniqueId'

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
    />
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
