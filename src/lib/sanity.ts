import groq from 'groq'
import PicoSanity from 'picosanity'

export const client = new PicoSanity({
  projectId: 'x8jn2l2i',
  dataset: 'production',
  apiVersion: '2022-09-01',
  useCdn: true
})

export type PostQueryStub = {
  title: string
  slug: string
  id: string
  _score: number
}

export async function fetchPostsWithQuery(params: {
  locale: string
  query: string
}): Promise<PostQueryStub[]> {
  return client.fetch(
    groq`
    *[_type == "post"]
    | score(title[$locale] match $query)
    | order(_score desc)
    {
      "title": title[$locale],
      "slug": slug.current,
      "id": _id
    }
    [0..9]
  `,
    params
  )
}
