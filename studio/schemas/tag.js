import {
  createLocaleSchema,
  defaultLocale
} from '../lib/locales'

export default {
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    createLocaleSchema({
      name: 'title',
      type: 'string'
    }),
    {
      name: 'slug',
      type: 'slug',
      options: {
        source: `title.${defaultLocale}`
      }
    }
  ],
  preview: {
    select: {
      title: `title.${defaultLocale}`
    }
  }
}
