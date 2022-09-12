export function replaceLocale(path, locale) {
  const [, , ...rest] = path.split('/')
  return ['', locale, ...rest].join('/')
}
