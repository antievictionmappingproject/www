import { defaultLocale } from "../lib/locales";

export default {
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    {
      name: "title",
      type: "localeString",
    },
    {
      name: "slug",
      type: "slug",
      options: {
        source: `title.${defaultLocale}`,
      },
    },
  ],
  preview: {
    select: {
      title: `title.${defaultLocale}`,
    },
  },
};
