import { createLocaleSchema } from "../lib/locales";

const localeString = createLocaleSchema({
  title: "Localized string",
  name: "localeString",
  type: "string",
});

export default localeString;
