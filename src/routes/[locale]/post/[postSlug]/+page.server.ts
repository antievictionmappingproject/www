import groq from 'groq'
import {client} from '$lib/sanity'

/** @type {import('./$types').PageLoad} */
export async function load({
  params
}: {
  params: {$postSlug: string; $locale: string}
}) {
  const post = await client.fetch(
    groq`
        *[_type == "post" && slug.current == $postSlug][0] {
          "subtitle": excerpt[$locale],
          "author": author->name,
          "tags": tags[]->title,
          "locations": locations[]->title,
          "datePublished": datePublished,
          "dateUpdated": dateUpdated,
          "mainImage": mainImage.asset->
        }
      `,
    params
  )
  return {
    post
  }
}
