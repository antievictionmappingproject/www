export default {
  name: 'twoPostSection',
  title: 'Two Post Section',
  type: 'object',
  fields: [
    {
      name: 'variant',
      type: 'string',
      title: 'Which one is big?',
      options: {
        list: ['first', 'second', 'both', 'neither']
      },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'posts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: {
            type: 'post'
          }
        }
      ],
      validation: (Rule) => Rule.required().length(2)
    }
  ]
}
