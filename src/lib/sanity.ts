import groq from 'groq'
import PicoSanity from 'picosanity'

export const client = new PicoSanity({
  projectId: 'x8jn2l2i',
  dataset: 'production',
  apiVersion: '2021-11-28',
  useCdn: true
})

export type PostQueryStub = {
  title: string
  slug: string
  id: string
}

export async function fetchPostsWithQuery(params: {
  locale: string
  query: string
}): Promise<PostQueryStub[]> {
  return client.fetch(
    groq`
    *[_type == "post"]
    {
      "title": title[$locale],
      "slug": slug.current,
      "id": _id
    }
    | score(title match $query)
    | order(_score desc)
    [0..9]
  `,
    params
  )
}
