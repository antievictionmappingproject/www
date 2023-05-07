import groq from 'groq'
import {client} from '$lib/sanity'
import {post as postQuery} from '$lib/queries'

/** @type {import('./$types').PageLoad} */
export async function load({
  params
}: {
  params: {locale: string}
}) {
  const result = await client.fetch(
    groq`*[_type == "post"]${postQuery}[0..10]
    `,
    params
  )

  return {
    posts: result
  }
}
