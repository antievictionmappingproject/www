<script lang="ts">
  import classes from '$lib/ui.module.css'
  import {nextUniqueId} from '$lib/utils/uniqueId'

  export let options: {value: string; label: string}[]
  export let value: string = ''
  export let label: string

  const id = nextUniqueId()
</script>

<div>
  <label for={id}>{label}:</label>
  <select {id} bind:value class={classes.input}>
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
</div>

<style>
  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  select {
    appearance: none;
  }
</style>
