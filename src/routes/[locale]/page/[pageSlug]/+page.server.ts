import groq from 'groq'
import {client} from '$lib/sanity'
import {query as pageQuery} from '$lib/components/Page.svelte'

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

  console.log(page)
  return {
    page
  }
}
