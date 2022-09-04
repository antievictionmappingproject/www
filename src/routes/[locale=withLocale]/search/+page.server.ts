import groq from 'groq'
import {getClient} from '$lib/sanity'

export async function load({params}) {
  const postStubs = await getClient().fetch(
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
  const all = await getClient().fetch(groq`*[_type=="post"]`)

  return {
    postStubs,
    all
  }
}
