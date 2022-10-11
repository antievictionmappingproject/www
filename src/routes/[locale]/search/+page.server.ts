import groq from 'groq'
import {client} from '$lib/sanity'
import {post, tag, location} from '$lib/queries'

interface SearchPageServerLoadArgs {
  params: {
    locale: string
  }
  url: URL
}

const searchFilter = groq`
  | score([title[$locale], body[$locale]] match $search)
  | order(_score desc)
  [_score > 0]
`

const tagFilter = groq`
  [count((tags[]->slug.current)[@ in $tags]) > 0]
`

const locationFilter = groq`
  [count((locations[]->slug.current)[@ in $locations]) > 0]
`

export async function load({
  params,
  url
}: SearchPageServerLoadArgs) {
  const search = url.searchParams.get('query')
  const tags = url.searchParams.getAll('tag')
  const locations = url.searchParams.getAll('location')

  return await client.fetch(
    groq`{
      "posts":
        *[_type == "post"]
        ${search ? searchFilter : ''}
    } {
      ...,
      "tags":
        *[_type == "tag" && count(^.posts[references(^._id)]) > 0]
        ${tag}
        [defined(slug)]
        [0...10]
        {..., "checked": slug in $tags},
      "locations":
        *[_type == "location" && count(^.posts[references(^._id)]) > 0]
        ${location}
        [defined(slug)]
        [0...10]
        {..., "checked": slug in $locations},
      "posts": posts[]
        ${tags?.length > 0 ? tagFilter : ''}
        ${locations?.length > 0 ? locationFilter : ''}
        ${post}
    }`,
    {
      locale: params.locale,
      search,
      tags,
      locations
    }
  )
}
