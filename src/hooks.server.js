import {baseLocale} from '$i18n/i18n-util'

/** @type {import('@sveltejs/kit').Handle} */
export function handle({event, resolve}) {
  return resolve(event, {
    transformPageChunk: ({html}) =>
      html.replace('%lang%', event.params.locale ?? baseLocale)
  })
}
