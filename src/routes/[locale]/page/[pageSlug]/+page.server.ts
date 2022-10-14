import groq from 'groq'
import {client} from '$lib/sanity'
import {page as pageQuery} from '$lib/queries'

/** @type {import('./$types').PageLoad} */
export async function load({
  params
}: {
  params: {pageSlug: string; locale: string}
}) {
  const page = await client.fetch(
    groq`*[_type == "page" && slug.current == $pageSlug][0] {
      ...${pageQuery},
      _type
    }`,
    params
  )

  return {
    page
  }
}
