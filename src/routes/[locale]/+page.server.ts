import groq from 'groq'
import {client} from '$lib/sanity'
import {page as pageQuery} from '$lib/queries'

/** @type {import('./$types').PageLoad} */
export async function load({
  params
}: {
  params: {locale: string}
}) {
  const {page} = await client.fetch(
    groq`
      *[_type == "site"][0] {
        "page": homePage->${pageQuery}
      }
    `,
    params
  )

  return {
    page
  }
}
