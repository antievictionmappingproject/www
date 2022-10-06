import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

import site from './site'
import post from './post'
import page from './page'
import author from './author'
import location from './location'
import tag from './tag'
import textSection from './textSection'
import twoPostSection from './twoPostSection'
import threePostSection from './threePostSection'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    site,
    post,
    page,
    author,
    location,
    tag,
    textSection,
    twoPostSection,
    threePostSection
  ])
})
