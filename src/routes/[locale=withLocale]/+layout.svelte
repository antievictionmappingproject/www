<script>
  import {page} from '$app/stores'
  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import {replaceLocale} from '$lib/url'
  const locales = [
    {code: 'es', label: 'Español'},
    {code: 'en', label: 'English'}
  ]
</script>

<svelte:head>
  {#each locales as { code }}
    <link
      rel="alternate"
      hreflang={code}
      href={replaceLocale($page.url.pathname, code)}
    />
  {/each}
</svelte:head>

<div class="page">
  <Header />
  <main>
    <slot />
  </main>
  <Footer {locales} />
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    background-color: var(--background);
    color: var(--text);
  }

  main {
    flex: 1;
    border-top: solid 1px var(--text);
    border-bottom: solid 1px var(--text);
  }
</style>
