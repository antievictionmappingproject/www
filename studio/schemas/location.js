export default {
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    {
      name: "title",
      type: "string",
    },
    {
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    },
  ],
  preview: {
    select: {
      title: "title",
    },
  },
};
