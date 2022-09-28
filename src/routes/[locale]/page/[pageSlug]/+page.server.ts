import groq from 'groq'
import {client} from '$lib/sanity'

/** @type {import('./$types').PageLoad} */
export async function load({
  params
}: {
  params: {$pageSlug: string; $locale: string}
}) {
  const page = await client.fetch(
    groq`
        *[_type == "page" && slug.current == $pageSlug][0] {
          "title": title[$locale],
          "sections": sections[] {
            "body": body[$locale]
          }
        }
      `,
    params
  )
  return {
    page
  }
}
