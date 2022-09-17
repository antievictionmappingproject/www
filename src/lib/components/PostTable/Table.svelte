<script lang="ts">
  import type {Post} from '$lib/types'
  import {page} from '$app/stores'
  import Filter from './Filter.svelte'
  import Preview from './Preview.svelte'
  import Tag from './Tag.svelte'

  export let posts: Post[] = []

  const locale = $page.params.locale

  let selectedIndex: number
  let filteredPosts = [...posts]
</script>

<div class="root">
  <caption id="caption">Posts</caption>
  <Filter {posts} bind:filteredPosts />
  <div
    class="tableContainer"
    role="region"
    aria-labelledby="caption"
    tabindex="0"
  >
    <table>
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
              <a class="postLink" href="/post/{post.slug}"
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
  <Preview post={posts[selectedIndex]} />
</div>

<style>
  .root {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(4, 1fr);
  }

  .tableContainer {
    grid-column-end: span 2;
  }

  /*
    Tables that may scroll need to be focusable: https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html
  */
  [role='region'][aria-labelledby][tabindex]:focus {
    outline: 1px solid cornflowerblue;
  }
  [role='region'][aria-labelledby][tabindex] {
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    overflow: auto;
    max-width: 100%;
    background: linear-gradient(
        to right,
        var(--color-background) 20%,
        rgba(255, 255, 255, 0)
      ),
      linear-gradient(
          to right,
          rgba(255, 255, 255, 0),
          var(--color-background) 80%
        )
        0 100%,
      linear-gradient(
        to right,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0)
      ),
      linear-gradient(
          to left,
          rgba(0, 0, 0, 0.1),
          rgba(0, 0, 0, 0)
        )
        0 100%;
    background-repeat: no-repeat;
    background-color: var(--color-background);
    background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
    background-position: 0 0, 100%, 0 0, 100%;
    background-attachment: local, local, scroll, scroll;
  }

  caption {
    grid-column-end: span 4;
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

  .postLink:hover {
    text-decoration: underline;
  }
</style>
