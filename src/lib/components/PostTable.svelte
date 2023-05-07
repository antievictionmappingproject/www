<script lang="ts">
  import {locale} from '$i18n/i18n-svelte'
  import type {Post} from '$lib/types'
  import {formatDate, titleCase} from '$lib/utils/string'
  import SanityPicture from './SanityPicture.svelte'

  export let posts: Post[] = []
  export let labelledBy: string
</script>

<!-- Tables that may scroll need to be focusable: https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div role="region" aria-labelledby={labelledBy} tabindex="0">
  <table>
    <tbody>
      {#each posts as post}
        <tr data-slug={post.slug}>
          <td class="image">
            <div class="picture-container">
              <SanityPicture
                image={post.image}
                metadata={post.image.metadata}
                alt="placeholder"
              />
            </div>
          </td>
          <td class="title">
            <a
              href={`/${$locale}/post/${post.slug}`}
              tabindex="-1"
            >
              {post.title}
            </a>
          </td>
          <td class="description">
            {post.excerpt || ''}
          </td>
          <td class="date">
            {formatDate(post.datePublished)}
          </td>
          <td class="locations">
            {post.locations
              .map((loc) =>
                titleCase(loc.title.replaceAll('-', ' '))
              )
              .join(', ')}
          </td>
          <td class="tags">
            {post.tags
              .map((tag) => titleCase(tag.title))
              .join(', ')}
          </td>
          <td class="link-icon"> placeholder </td>
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
  table {
    min-width: 100%;
  }

  tbody > tr {
    position: relative;
  }

  tr {
    border-bottom: 1px dashed rgba(0, 0, 0, 0.3);
  }

  td {
    position: relative;
    vertical-align: top;
    padding: 1rem;
  }

  .picture-container {
    width: 15ch;
    aspect-ratio: 1 / 1;
  }

  .title {
    font-size: 1.5rem;
    word-wrap: normal;
    max-width: 25ch;
  }

  .description {
    display: flex;
    flex-direction: column;
    max-width: 40ch;
  }

  .empty {
    text-align: center;
    padding-block: var(--spacing-2);
  }
</style>
