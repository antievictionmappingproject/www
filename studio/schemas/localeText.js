import { createLocaleSchema } from "../lib/locales";

const localeText = createLocaleSchema({
  title: "Localized text",
  name: "localeText",
  type: "text",
});

export default localeText;
