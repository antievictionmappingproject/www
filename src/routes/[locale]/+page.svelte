<script lang="ts">
  import type {PageData} from './$types'
  import PostTable from '$lib/components/PostTable.svelte'
  import Featured from '$lib/components/Featured.svelte'

  export let data: PageData
  $: featured = data.posts.slice(0, 3)
</script>

<div class="featured-section">
  {#each featured as featuredPost}
    <Featured post={featuredPost} />
  {/each}
</div>
<PostTable posts={data.posts} labelledBy={'asdf'} />

<style>
  .featured-section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3rem;
    padding: 3rem 1rem;
    border-top: 1px dashed rgba(0, 0, 0, 0.3);
    border-bottom: 1px dashed rgba(0, 0, 0, 0.3);
  }
</style>
