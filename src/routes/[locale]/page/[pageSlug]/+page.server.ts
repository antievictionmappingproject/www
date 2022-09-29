import groq from 'groq'
import {client} from '$lib/sanity'

const postStubFragment = groq`
  {
    "title": title[$locale],
    "image": mainImage.asset->
  }
`

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
          _type,
          _type == "textSection" => {
            "body": body[$locale]
          },
          _type == "twoPostSection" => {
            variant,
            "posts": posts[]->${postStubFragment}
          },
          _type == "threePostSection" => {
            variant,
            "posts": posts[]->${postStubFragment}
          }
        }
      }
    `,
    params
  )
  return {
    page
  }
}
