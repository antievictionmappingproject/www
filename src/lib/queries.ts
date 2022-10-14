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
  "image": mainImage.asset->
}`

export const postStub = groq`{
  "title": title[$locale],
  "image": mainImage.asset->,
  "date": datePublished,
  "slug": slug.current
}`

export const textSection = groq`{
  "body": body[$locale]
}`

export const twoPostSection = groq`{
  "posts": posts[]->${postStub}
}`

export const threePostSection = groq`{
  "posts": posts[]->${postStub}
}`

export const page = groq`{
  "title": title[$locale],
  "sections": sections[] {
    _type,
    _type == "textSection" => ${textSection},
    _type == "twoPostSection" => ${twoPostSection},
    _type == "threePostSection" => ${threePostSection}
  }
}`
