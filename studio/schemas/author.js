export default {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    {
      name: "name",
      type: "string",
    },
    {
      name: "slug",
      type: "slug",
      options: {
        source: "name",
      },
    },
    {
      name: "image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "bio",
      title: "Bio",
      type: "localeText",
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
};
