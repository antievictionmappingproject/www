/* various functions that return strings */

/** generates a random (dark-ish) color; perhaps we should
 * constrain it somewhat later, or hardcode them */
export function genColor(): string {
  return 'hsl(' + Math.random() * 360 + ', 100%, 30%)'
}

export function formatDate(
  date: Date | string,
  short = false
): string {
  const options = {
    month: short ? 'short' : 'long',
    ...(short ? {} : {day: 'numeric'}),
    year: 'numeric'
  }

  return new Intl.DateTimeFormat(
    'en-US',
    options as any
  ).format(typeof date === 'string' ? new Date(date) : date)
}

export function titleCase(str: string) {
  return str
    .split(' ')
    .map((piece) =>
      piece
        .split('')
        .map((char, i) => {
          return i === 0 ? char.toUpperCase() : char
        })
        .join('')
    )
    .join(' ')
}
