export function replaceLocale(
  path: string,
  locale: string
): string {
  const [, , ...rest] = path.split('/')
  return ['', locale, ...rest].join('/')
}
