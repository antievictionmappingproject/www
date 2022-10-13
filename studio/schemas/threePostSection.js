export default {
  name: 'threePostSection',
  title: 'Three Post Section',
  type: 'object',
  fields: [
    {
      name: 'variant',
      type: 'string',
      title: 'Which one is big?',
      options: {
        list: ['first', 'third', 'none']
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
      validation: (Rule) => Rule.required().length(3)
    }
  ]
}
