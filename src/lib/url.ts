export function replaceLocale(
  path: string,
  locale: string
): string {
  const [, , ...rest] = path.split('/')
  return ['', locale, ...rest].join('/')
}

export function withoutSearchParam(url: URL, name: string) {
  const nextURL = new URL(url)
  nextURL.searchParams.delete(name)
  return nextURL
}
