import groq from 'groq'
import {client} from '$lib/sanity'

interface SearchPageServerLoadArgs {
  params: {
    locale: string
  }
  url: URL
}

const postStubFragment = groq`{
  _id,
  "author": author->name,
  "title": title[$locale],
  "slug": slug.current,
  "tags": tags[]->title,
  "locations": locations[]->title,
  "datePublished": datePublished,
  "dateUpdated": dateUpdated,
  "imageUrl": mainImage.asset->url
}`

export async function load({
  params,
  url
}: SearchPageServerLoadArgs) {
  const query = url.searchParams.get('query')
  return {
    query,
    postStubs: await client.fetch(
      query
        ? groq`
          *[_type == "post"]
          | score([title[$locale], body[$locale]] match $query)
          | order(_score desc)
          [_score > 0]
          ${postStubFragment}
        `
        : groq`
          *[_type == "post"]
          ${postStubFragment}
        `,
      {
        locale: params.locale,
        query
      }
    )
  }
}
