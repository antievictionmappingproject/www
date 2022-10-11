<script lang="ts">
  import {locale} from '$i18n/i18n-svelte'
  import uiClasses from '$lib/ui.module.css'

  export let query: string | undefined = undefined
</script>

<form action={`/${$locale}/search`} method="get">
  {#if query}
    <input type="text" name="query" value={query} hidden />
  {/if}
  <slot />
  <button type="submit" class={uiClasses.input}>
    Apply Filters
  </button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
    min-width: 10rem;
  }
</style>
