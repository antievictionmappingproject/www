import groq from 'groq'

export const tag = groq`{
  "type": _type,
  "title": title[$locale],
  "slug": slug.current
}`

export const location = groq`{
  "type": _type,
  "title": title,
  "slug": slug.current
}`

export const author = groq`{
  name,
  "slug": slug.current
}`

export const post = groq`{
  "author": author->${author},
  "title": title[$locale],
  "slug": slug.current,
  "tags": tags[0..5]->${tag},
  "locations": locations[0..5]->${location},
  "datePublished": datePublished,
  "dateUpdated": dateUpdated,
  "imageUrl": mainImage.asset->url
}`
