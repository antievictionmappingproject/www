<script lang="ts">
  import {locale} from '$i18n/i18n-svelte'
  import SearchForm from './SearchForm.svelte'
</script>

<header>
  <div class="row">
    <a href={`/${$locale}`} class="title">
      The Anti-Eviction Mapping Project
    </a>
    <SearchForm />
  </div>
</header>

<style>
  .row {
    padding: var(--spacing-0);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>
