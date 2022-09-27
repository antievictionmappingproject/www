import {createLocaleSchema} from '../lib/locales.js'

export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string'
    },
    {
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name'
      }
    },
    {
      name: 'image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    createLocaleSchema({
      name: 'bio',
      title: 'Bio',
      type: 'text'
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image'
    }
  }
}
