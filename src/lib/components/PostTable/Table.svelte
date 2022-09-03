<script lang="ts">
  import type {Post} from '$lib/types'
  import {page} from '$app/stores'
  import Filter from './Filter.svelte'
  import Preview from './Preview.svelte'
  import Tag from './Tag.svelte'

  export let posts: Post[] = [],
    caption = undefined

  const locale = $page.params.locale

  let selectedIndex: number
  let filteredPosts = [...posts]
</script>

<div class="post-table">
  <div class="container">
    <Filter {posts} bind:filteredPosts />
  </div>
  <div class="container">
    <table>
      {#if caption}
        <caption>
          {caption}
        </caption>
      {/if}
      <thead>
        <tr>
          <th>Title</th>
          <th>Tags</th>
          <th>Author</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredPosts as post, index}
          <tr
            style={selectedIndex === index
              ? 'background-color: yellow;'
              : ''}
            on:click={() => {
              selectedIndex = index
            }}
          >
            <td>
              <a class="post-link" href="/post/{post.slug}"
                >{post.title}</a
              >
            </td>
            <td class="tags">
              {#if post.tags}
                {#each post.tags as tag}
                  <Tag tag={tag[locale]} type="tag" />
                {/each}
              {/if}
            </td>
            <td>
              {post.author}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="container">
    <Preview post={posts[selectedIndex]} />
  </div>
</div>

<style>
  .post-table {
    max-width: 100%;
    min-height: 0;
    max-height: 100%;
    display: grid;
    grid-template-columns: 20% auto 20%;
    position: relative;
  }

  .container {
    height: 100%;
    overflow-y: auto;
    scrollbar-width: thin;
    scroll-behavior: smooth;
  }

  /* all this for a simple scrollbar...*/
  .container::-webkit-scrollbar {
    width: 0.3rem;
    height: 0.3rem;
  }
  .container::-webkit-scrollbar-track {
    background: none;
  }
  .container::-webkit-scrollbar-thumb {
    background: var(--color-gray-4);
  }

  table {
    flex: 1;
  }

  th {
    text-transform: uppercase;
    color: var(--faded-text);
  }

  tr {
    transition: background-color ease-in-out 200ms;
    cursor: pointer;
    box-sizing: border-box;
  }

  th,
  td {
    width: fit-content;
    padding: 0.5rem;
    margin: 0.5rem 0;
    vertical-align: top;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .post-link:hover {
    text-decoration: underline;
  }
</style>
