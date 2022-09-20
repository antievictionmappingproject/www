import groq from 'groq'
import PicoSanity from 'picosanity'

export const client = new PicoSanity({
  projectId: 'x8jn2l2i',
  dataset: 'production',
  apiVersion: '2021-11-28',
  useCdn: true
})

export async function fetchPosts(params) {
  return client.fetch(
    groq`
    *[_type == "post"]
    {
      "title": title[$locale],
      "body": body[$locale],
      "id": _id
    }
    | score([title, body] match $query)
    | order(_score desc)
    [0..9]
  `,
    params
  )
}
