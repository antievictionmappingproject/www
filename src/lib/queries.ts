import groq from 'groq'

export const tag = groq`{
  "type": _type,
  "title": title[$locale],
  "slug": slug.current
}`

export const location = groq`{
  "type": _type,
  "title": title[$locale],
  "slug": slug.current
}`

export const post = groq`{
  "author": author->name,
  "title": title[$locale],
  "slug": slug.current,
  "tags": tags[]->${tag},
  "locations": locations[]->${location},
  "datePublished": datePublished,
  "dateUpdated": dateUpdated,
  "imageUrl": mainImage.asset->url
}`
