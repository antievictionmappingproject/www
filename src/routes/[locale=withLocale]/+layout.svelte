<script>
  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
</script>

<div class="page">
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
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
