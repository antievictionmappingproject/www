import groq from 'groq'
import {getClient} from '$lib/sanity'

export interface Data {
  previews: {slug: string; title: string; imageUrl: string}[]
}

export async function load({params}) {
  const previews = await getClient().fetch(
    groq`
        *[_type == "post"] {
          "slug": slug.current,
          "imageUrl": mainImage.asset->url,
          "title": title[$locale]
        }[0...10]
      `,
    params
  )

  return {
    previews
  }
}
