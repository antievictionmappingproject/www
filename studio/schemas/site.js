export default {
  name: 'site',
  title: 'Site',
  type: 'document',
  fields: [
    {
      name: 'homePage',
      type: 'reference',
      to: {type: 'page'}
    }
  ]
}
