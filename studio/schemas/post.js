import {
  defaultLocale,
  createLocaleSchema
} from '../lib/locales.js'

export default {
  name: 'post',
  title: 'Post',
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
    },
    createLocaleSchema({
      name: 'excerpt',
      type: 'text'
    }),
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'}
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'locations',
      type: 'array',
      of: [{type: 'reference', to: {type: 'location'}}]
    },
    {
      name: 'tags',
      type: 'array',
      of: [{type: 'reference', to: {type: 'tag'}}]
    },
    {
      name: 'datePublished',
      title: 'Date published',
      type: 'datetime'
    },
    {
      name: 'dateUpdated',
      title: 'Date updated',
      type: 'datetime'
    },
    createLocaleSchema({
      name: 'body',
      type: 'array',
      of: [
        {type: 'image'},
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'}
          ],
          lists: [{title: 'Bullet', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'}
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        }
      ]
    })
  ],

  preview: {
    select: {
      title: `title.${defaultLocale}`,
      author: 'author.name',
      media: 'mainImage'
    },
    prepare(selection) {
      const {author} = selection
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`
      })
    }
  }
}
