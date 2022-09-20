import groq from 'groq'
import {client} from '$lib/sanity'

export async function load({params}) {
  const postStubs = await client.fetch(
    groq`
        *[_type == "post"] {
					_id,
          "author": author->name,
          "title": title[$locale],
          "slug": slug.current,
          "tags": tags[]->title,
          "locations": locations[]->title,
          "datePublished": datePublished,
          "dateUpdated": dateUpdated,
          "imageUrl": mainImage.asset->url
        }
      `,
    {locale: params.locale}
  )
  const all = await client.fetch(groq`*[_type=="post"]`)

  return {
    postStubs,
    all
  }
}
