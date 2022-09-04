import { createLocaleSchema, defaultLocale } from "../lib/locales";

export default {
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    createLocaleSchema({
      name: "title",
      type: "string",
    }),
    {
      name: "slug",
      type: "slug",
      options: {
        source: `title.${defaultLocale}`,
        maxLength: 96,
      },
    },
    {
      name: "sections",
      type: "array",
      of: [{ type: "textSection" }],
    },
  ],

  preview: {
    select: {
      title: `title.${defaultLocale}`,
      subtitle: "slug.current",
    },
  },
};
