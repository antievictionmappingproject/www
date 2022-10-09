import groq from 'groq'
import {client} from '$lib/sanity'
import {postQuery as postTablePostQuery} from '$lib/components/PostTable.svelte'
import {postQuery as postPreviewSidebarPostQuery} from '$lib/components/PostPreviewSidebar.svelte'

interface SearchPageServerLoadArgs {
  params: {
    locale: string
  }
  url: URL
}

const postQuery = groq`{
  ...${postTablePostQuery},
  ...${postPreviewSidebarPostQuery}
}`

export async function load({
  params,
  url
}: SearchPageServerLoadArgs) {
  const query = url.searchParams.get('query')
  return {
    query,
    posts: await client.fetch(
      query
        ? groq`
          *[_type == "post"]
          | score([title[$locale], body[$locale]] match $query)
          | order(_score desc)
          [_score > 0]
          ${postQuery}
        `
        : groq`
          *[_type == "post"]
          ${postQuery}
        `,
      {
        locale: params.locale,
        query
      }
    )
  }
}
