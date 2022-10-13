import groq from 'groq'
import {client} from '$lib/sanity'
import {post as postQuery} from '$lib/queries'

/** @type {import('./$types').PageLoad} */
export async function load({
  params
}: {
  params: {postSlug: string; locale: string}
}) {
  const post = await client.fetch(
    groq`
        *[_type == "post" && slug.current == $postSlug][0]${postQuery}
      `,
    params
  )
  return {
    post
  }
}
