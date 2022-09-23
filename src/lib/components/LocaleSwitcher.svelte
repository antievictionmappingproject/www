<script lang="ts">
  import {browser} from '$app/environment'
  import {page} from '$app/stores'
  import {
    LL,
    setLocale,
    locale as currentLocale
  } from '$i18n/i18n-svelte'
  import type {Locales} from '$i18n/i18n-types'
  import {locales} from '$i18n/i18n-util'
  import {loadLocaleAsync} from '$i18n/i18n-util.async'
  import {replaceLocale} from '../url'

  const switchLocale = async (
    newLocale: Locales,
    updateHistoryState = true
  ) => {
    if (!newLocale || $currentLocale === newLocale) return

    // load new dictionary from server
    await loadLocaleAsync(newLocale)

    // select locale
    setLocale(newLocale)

    // update `lang` attribute
    document.documentElement.setAttribute('lang', newLocale)

    if (updateHistoryState) {
      // update url to reflect locale changes
      history.pushState(
        {locale: newLocale},
        '',
        replaceLocale(location.pathname, newLocale)
      )
    }
  }

  // update locale when navigating via browser back/forward buttons
  const handlePopStateEvent = async ({state}: PopStateEvent) =>
    switchLocale(state.locale, false)

  // update locale when page store changes
  $: if (browser) {
    const lang = $page.params.lang as Locales
    switchLocale(lang, false)
    history.replaceState(
      {...history.state, locale: lang},
      '',
      replaceLocale(location.pathname, lang)
    )
  }
</script>

<svelte:window on:popstate={handlePopStateEvent} />

<div>
  <div>{$LL.localeSwitcher.description()}</div>
  <ul>
    {#each locales as locale}
      <li>
        <button
          type="button"
          class:active={locale === $currentLocale}
          on:click={() => switchLocale(locale)}
        >
          {locale}
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  button:not(.active) {
    text-decoration-line: underline;
  }
</style>
