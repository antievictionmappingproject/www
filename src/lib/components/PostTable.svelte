<script lang="ts">
  import {locale} from '$i18n/i18n-svelte'
  import FilterAnchor from './FilterAnchor.svelte'
  import AuthorAnchor from './AuthorAnchor.svelte'
  import CommaSeparatedEach from './CommaSeparatedEach.svelte'
  import type {Post} from '$lib/types'

  export let posts: Post[] = []
  export let labelledBy: string
</script>

<!-- Tables that may scroll need to be focusable: https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html -->
<div role="region" aria-labelledby={labelledBy} tabindex="0">
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Author</th>
        <th>Tags</th>
        <th>Locations</th>
      </tr>
    </thead>
    <tbody>
      {#each posts as post}
        <tr>
          <td>
            <a href={`/${$locale}/post/{post.slug}`}>
              {post.title}
            </a>
          </td>
          <td>
            <AuthorAnchor {...post.author} />
          </td>
          <td>
            <CommaSeparatedEach
              items={post.tags ?? []}
              let:item
            >
              <FilterAnchor {...item} />
            </CommaSeparatedEach>
          </td>
          <td>
            <CommaSeparatedEach
              items={post.locations ?? []}
              let:item
            >
              <FilterAnchor {...item} />
            </CommaSeparatedEach>
          </td>
        </tr>
      {:else}
        <tr
          ><td colspan="4" class="empty"
            >There's nothing here.</td
          ></tr
        >
      {/each}
    </tbody>
  </table>
</div>

<style>
  table {
    min-width: 100%;
  }

  [role='region'][aria-labelledby][tabindex] {
    overflow: auto;
    max-width: 100%;
    border-radius: var(--border-radius-small);
    background: linear-gradient(
        to right,
        var(--color-background) 50%,
        var(--color-background-transparent)
      ),
      linear-gradient(
        to left,
        var(--color-background) 50%,
        var(--color-background-transparent)
      ),
      linear-gradient(
        to right,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0)
      ),
      linear-gradient(
        to left,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0)
      );
    background-repeat: no-repeat;
    background-color: var(--color-background);
    background-size: 2rem 100%, 2rem 100%, 1rem 100%, 1rem 100%;
    background-position: 0 0, 100%, 0 0, 100%;
    background-attachment: local, local, scroll, scroll;
  }

  tr {
    transition: background-color ease-in-out 200ms;
    cursor: pointer;
    box-sizing: border-box;
  }

  th,
  td {
    width: fit-content;
    padding-block: var(--spacing-minus-1);
    padding-inline-end: var(--spacing-0);
    vertical-align: top;
  }

  th {
    text-transform: uppercase;
    padding-block-start: 0;
    border-block-end: var(--border-thin);
  }

  .empty {
    text-align: center;
    padding-block: var(--spacing-2);
  }
</style>
