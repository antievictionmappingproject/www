const locales = [
  { value: "en", title: "English", isDefault: true },
  { value: "es", title: "Spanish" },
];

export const defaultLocale = locales.find((locale) => locale.isDefault).value;

export function createLocaleSchema({ title, name, ...other }) {
  return {
    title,
    name,
    type: "object",
    fieldsets: [
      {
        title: "Translations",
        name: "translations",
        options: { collapsible: true },
      },
    ],
    fields: locales.map((locale) => ({
      title: locale.title,
      name: locale.value,
      fieldset: locale.isDefault ? null : "translations",
      ...other,
    })),
  };
}

export default locales;
