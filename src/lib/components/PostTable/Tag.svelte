<script lang="ts">
  import {tags, locations} from '$lib/store'

  export let tag: string
  export let type: 'location' | 'tag'

  let color: string
  $: {
    if (type === 'location') {
      color = $locations.get(tag)?.color
    } else if (type === 'tag') {
      color = $tags.get(tag)?.color
    }
  }
</script>

{#if tag}
  <div class="tag" style="color: {color};">
    {tag.replace(/^tag-/, '')}
  </div>
{/if}

<style>
  .tag {
    border: solid 1px black;
    border-radius: 0.5rem;
    padding: 0.3rem;
    width: fit-content;
    font-size: 0.8rem;
    transition: color ease-in-out 200ms;
  }
</style>
