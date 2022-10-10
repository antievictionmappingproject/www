<script lang="ts" context="module">
  import {query as filterAnchorQuery} from '$lib/components/FilterAnchor.svelte'

  export interface Post {
    title: string
    slug: string
    author: string
    tags: SvelteComponentProps<FilterAnchor>[]
  }

  export const postQuery = groq`{
    _id,
    "author": author->name,
    "title": title[$locale],
    "slug": slug.current,
    "tags": tags[]->${filterAnchorQuery},
  }`
</script>

<script lang="ts">
  import {locale} from '$i18n/i18n-svelte'
  import groq from 'groq'
  import type {SvelteComponentProps} from '$lib/types'
  import FilterAnchor from './FilterAnchor.svelte'
  import CommaSeparatedEach from './CommaSeparatedEach.svelte'

  export let posts: Post[] = []
  export let labelledBy: string
</script>

<div role="region" aria-labelledby={labelledBy} tabindex="0">
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Tags</th>
        <th>Author</th>
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
            <CommaSeparatedEach items={post.tags} let:item>
              <FilterAnchor {...item} />
            </CommaSeparatedEach>
          </td>
          <td>
            {post.author}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  /*
    Tables that may scroll need to be focusable: https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html
  */
  [role='region'][aria-labelledby][tabindex]:focus {
    border-radius: var(--border-radius-small);
    outline: 2px solid var(--color-focus);
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
</style>
