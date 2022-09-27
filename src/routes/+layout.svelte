<script lang="ts">
  import {page} from '$app/stores'
  import '@nonphoto/css/reset.css'
  import '$lib/global.css'
  import {setLocale} from '$i18n/i18n-svelte'
  import {locales} from '$i18n/i18n-util'
  import type {LayoutData} from './$types'
  import {replaceLocale} from '$lib/url'

  export let data: LayoutData

  setLocale(data.locale)
</script>

<svelte:head>
  {#each locales as locale}
    <link
      rel="alternate"
      href={replaceLocale($page.url.pathname, locale)}
      hreflang={locale}
    />
  {/each}
</svelte:head>

<slot />
