<script lang="ts">
  import {page} from '$app/stores'
  import '@nonphoto/css/reset.css'
  import '$lib/global.css'

  import {setLocale} from '$i18n/i18n-svelte'
  import {locales} from '$i18n/i18n-util'
  import {replaceLocale} from '$lib/url'
  import {loadLocaleAsync} from '$i18n/i18n-util.async'
  import type {Locales} from '$i18n/i18n-types'
  import type {LayoutData} from './$types'
  import {browser} from '$app/environment'

  export let data: LayoutData

  console.log(data)

  setLocale(data.locale)

  $: {
    if (browser) {
      const nextLocale = $page.params.locale as Locales
      ;(async () => {
        await loadLocaleAsync(nextLocale)
        setLocale(nextLocale)
        document.documentElement.setAttribute(
          'lang',
          nextLocale
        )
      })()
    }
  }
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
