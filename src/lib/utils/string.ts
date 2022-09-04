/* various functions that return strings */

/** generates a random (dark-ish) color; perhaps we should
 * constrain it somewhat later, or hardcode them */
export function genColor(): string {
  return 'hsl(' + Math.random() * 360 + ', 100%, 30%)'
}

export function formatDate(date: Date | string): string {
  const options = {
    month: 'long',
    year: 'numeric',
    day: 'numeric'
  }

  return new Intl.DateTimeFormat(
    'en-US',
    options as any
  ).format(typeof date === 'string' ? new Date(date) : date)
}
