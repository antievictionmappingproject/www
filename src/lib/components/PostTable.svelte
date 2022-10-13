<script lang="ts">
  import {locale} from '$i18n/i18n-svelte'
  import AuthorAnchor from './AuthorAnchor.svelte'
  import type {Post} from '$lib/types'

  export let posts: Post[] = []
  export let labelledBy: string
</script>

<!-- Tables that may scroll need to be focusable: https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html -->
<div role="region" aria-labelledby={labelledBy} tabindex="0">
  <table>
    <thead>
      <tr>
        <th><button tabindex="-1">Title</button></th>
        <th><button tabindex="-1">Author</button></th>
        <th><button tabindex="-1">Date Published</button></th>
      </tr>
    </thead>
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <tbody>
      {#each posts as post}
        <tr data-slug={post.slug}>
          <td>
            <a
              href={`/${$locale}/post/${post.slug}`}
              tabindex="-1"
            >
              {post.title}
            </a>
          </td>
          <td>
            <AuthorAnchor {...post.author} tabindex={-1} />
          </td>
          <td>
            {post.datePublished}
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="4" class="empty">
            There's nothing here.
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  [role='region'] {
    overflow: auto;
    max-width: 100%;
    margin-top: calc(var(--spacing-minus-1) * -1);
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

  table {
    min-width: 100%;
    margin-inline: 2px;
  }

  th {
    border-block-end: var(--border-thin);
    padding-block: var(--spacing-minus-1);
    text-transform: uppercase;
  }

  th:first-child {
    min-width: 25ch;
  }

  th button {
    text-transform: uppercase;
    border-radius: var(--border-radius-small);
    padding-inline: var(--spacing-minus-1);
    white-space: pre;
  }

  th button:hover {
    background-color: var(--color-1);
  }

  tbody > tr {
    position: relative;
    border-radius: var(--border-radius-small);
  }

  tbody > tr::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: var(--border-radius-small);
  }

  tbody > tr:hover::after {
    background: var(--color-1);
  }

  td {
    position: relative;
    z-index: 1;
    width: fit-content;
    padding: var(--spacing-minus-1);
    vertical-align: top;
  }

  .empty {
    text-align: center;
    padding-block: var(--spacing-2);
  }
</style>
