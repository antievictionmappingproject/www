<script>
  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
</script>

<div class="page">
  <div class="scrollable">
    <Header />
    <slot />
  </div>
  <Footer />
</div>

<style>
  .page {
    height: 100vh;
    min-height: 100%;
    max-height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .scrollable {
    overflow: auto;
  }
</style>
