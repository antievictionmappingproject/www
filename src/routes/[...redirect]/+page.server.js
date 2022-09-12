import {redirect, error} from '@sveltejs/kit'
import {match} from '../../params/withLocale'

/** @type {import('./$types').LayoutLoad} */
export function load({params}) {
  /* if locale is already present, this route should
   * send user to a 404
   * */
  if (match(params.redirect)) {
    throw error(404, 'page not found')
  }
  const locale = 'en'
  throw redirect(302, `/${locale}/${params.redirect}`)
}
