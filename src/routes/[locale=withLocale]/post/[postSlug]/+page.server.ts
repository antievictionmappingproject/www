import groq from 'groq'
import {client} from '$lib/sanity'

export async function load({params}) {
  const post = await client.fetch(
    groq`
        *[_type == "post" && slug.current == $postSlug][0] {
          "subtitle": excerpt[$locale],
          "author": author->name,
          "tags": tags[]->title,
          "locations": locations[]->title,
          "datePublished": datePublished,
          "dateUpdated": dateUpdated,
          "imageUrl": mainImage.asset->url
        }
      `,
    params
  )
  return {
    post
  }
}
