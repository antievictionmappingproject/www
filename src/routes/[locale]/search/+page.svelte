<script lang="ts">
  import PostTable from '$lib/components/PostTable/Table.svelte'
  import {page} from '$app/stores'
  import {onMount} from 'svelte'
  import {tags, locations} from '$lib/store'
  import {genColor} from '$lib/utils/string'
  import type {Post, Category} from '$lib/types'

  export let data: {postStubs: Post[]; query: string}

  function addToStore(
    map: Map<string, Category>,
    category: string
  ) {
    if (!map.has(category)) {
      const generatedColor = genColor()
      map.set(category, {
        name: category,
        color: generatedColor
      })
    }
  }

  onMount(() => {
    data.postStubs.forEach((posts: Post) => {
      posts.tags?.forEach((tag) =>
        addToStore($tags, tag[$page.params.locale])
      )
      posts.locations?.forEach((location) =>
        addToStore($locations, location)
      )
      /* to trigger app-wide update */
      tags.set($tags)
      locations.set($locations)
    })
  })
</script>

<div class="page">
  <PostTable posts={data.postStubs} query={data.query} />
</div>

<style>
  .page {
    width: 100%;
    height: 100%;
    display: flex;
    place-content: center;
  }
</style>
