<script lang="ts">
  import {nextUniqueId} from '$lib/utils/uniqueId'
  import uiClasses from '$lib/ui.module.css'

  const id = nextUniqueId()

  export let name: string
  export let value: string
  export let label: string
  export let checked: boolean
</script>

<div>
  <input
    {id}
    {name}
    {value}
    bind:checked
    class={uiClasses.checkbox}
    type="checkbox"
  />
  <label for={id}>
    {label}
  </label>
</div>

<style>
  div {
    display: flex;
    align-items: center;
    gap: var(--spacing-minus-1);
  }
</style>
