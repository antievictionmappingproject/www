import groq from 'groq'
import {getClient} from '$lib/sanity'

export async function load({params}) {
  const post = await getClient().fetch(
    groq`
        *[_type == "post" && slug.current == $postSlug][0] {
          "title": title[$locale],
          "body": body[$locale],
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
