<script lang="ts">
  import {LL} from '$i18n/i18n-svelte'
  import fitText from '$lib/utils/fitText'
  import {onMount} from 'svelte'
  import {slide} from 'svelte/transition'

  let size: number
  onMount(() => {
    size = fitText($LL.siteTitle())
  })
</script>

<header>
  {#if size}
    <h1 transition:slide style="font-size: {size}pt">
      {$LL.siteTitle()}
    </h1>
  {/if}
</header>

<style>
  header {
    max-width: 100vw;
    text-align: center;
  }
</style>
