import {redirect} from '@sveltejs/kit'
import type {Locales} from '$i18n/i18n-types'
import {replaceLocale} from '../lib/url'
import {baseLocale, locales} from '$i18n/i18n-util'
import {loadLocaleAsync} from '$i18n/i18n-util.async'

/** @type {import('./$types').PageData} */
export async function load({
  url,
  params
}: {
  url: URL
  params: {locale: string}
}) {
  const locale = params.locale as Locales
  console.log(locale)

  if (!locales.includes(locale)) {
    throw redirect(
      302,
      replaceLocale(url.pathname, baseLocale)
    )
  }

  await loadLocaleAsync(locale)

  return {locale}
}
