const locales = [
  { value: "en", title: "English" },
  { value: "es", title: "Español" },
];

export const defaultLocale = "en";

export function createLocaleSchema({ title, name, ...other }) {
  return {
    title,
    name,
    type: "object",
    fields: locales.map((locale) => ({
      title: locale.title,
      name: locale.value,
      ...other,
    })),
  };
}

export default locales;
