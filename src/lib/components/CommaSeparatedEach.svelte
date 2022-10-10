<script lang="ts">
  type T = $$Generic

  export let items: T[]

  interface $$Slots {
    default: {item: T}
  }
</script>

{#each items.map( (item, index) => ({item, join: index < items.length - 1 ? ', ' : ''}) ) as { item, join }}
  <slot {item} />{join}
{/each}
