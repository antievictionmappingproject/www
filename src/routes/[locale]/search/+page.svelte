<script lang="ts">
  import textClasses from '$lib/text.module.css'
  import {uniqBy, prop} from 'ramda'
  import {LL} from '$i18n/i18n-svelte'
  import PostTable from '$lib/components/PostTable.svelte'
  import type {Post as PostTablePost} from '$lib/components/PostTable.svelte'
  import PostFilterSidebar from '$lib/components/PostFilterSidebar.svelte'
  import PostPreviewSidebar from '$lib/components/PostPreviewSidebar.svelte'
  import type {Post as PostPreviewSidebarPost} from '$lib/components/PostPreviewSidebar.svelte'
  import {nextUniqueId} from '$lib/utils/uniqueId'

  const titleId = nextUniqueId()

  export let data: {
    posts: Array<PostTablePost & PostPreviewSidebarPost>
    query: string
  }

  let selectedPost: PostPreviewSidebarPost | undefined =
    undefined
</script>

<section>
  <h1 id={titleId} class={textClasses.titleSans}>
    {data.query
      ? $LL.search.results({query: data.query})
      : 'Posts'}
  </h1>
  <PostFilterSidebar
    tags={uniqBy(
      prop('slug'),
      data.posts.flatMap(prop('tags'))
    ).filter(prop('slug'))}
  />
  <PostTable posts={data.posts} labelledBy={titleId} />
  <PostPreviewSidebar post={selectedPost} />
</section>

<style>
  section {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--spacing-0);
    padding-inline: var(--spacing-0);
  }

  h1 {
    grid-column: 1 / -1;
    margin-block: calc(var(--spacing-2) - var(--spacing-0));
  }
</style>
