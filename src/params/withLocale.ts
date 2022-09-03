/**
 * matches if locale is specified in path
 * used by sveltekit filesystem-based routing
 * in src/routes/'[locale=withLocale].svelte'
 *
 * examples:
 * /en/posts/my-blog-post -> True
 * /posts/my-blog-post -> False, is not handled by the
 * '[locale].svelte' pageset and instead will be
 *  redirected first by [...redirect].svelte to
 *  either /en/... or /es/...
 **/
import type {ParamMatcher} from '@sveltejs/kit'
export const match: ParamMatcher = (param) => {
  const locales = ['en', 'es']
    .map((str) => `(${str})`)
    .join('|')
  const match = param.match(`^${locales}`)
  console.log(match)
  return !!match
}
