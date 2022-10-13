<script lang="ts">
  import {page} from '$app/stores'
  import {locale} from '$i18n/i18n-svelte'
  import uiClasses from '$lib/ui.module.css'
  import {withoutSearchParam} from '$lib/url'

  export let query: string | undefined = undefined
</script>

<form action={`/${$locale}/search`} method="get">
  <slot />
  <div class="buttons">
    {#if query}
      <input type="text" name="query" value={query} hidden />
      <a
        class={uiClasses.input}
        href={withoutSearchParam($page.url, 'query').href}
        >Clear search</a
      >
    {/if}
    <button type="submit" class={uiClasses.input}>
      Apply filters
    </button>
  </div>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
    min-width: 10rem;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-minus-1);
  }
</style>
