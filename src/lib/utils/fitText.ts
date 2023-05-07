/* Binary search for font size that makes text fit close to width of screen
 * Is not practical
 */
export default function fitText(str: string) {
  const container = document.createElement('div')
  container.style.width = '100px'
  container.style.overflow = 'auto'
  const el = document.createElement('h1')
  el.innerText = str
  const TOLERANCE = 0.1

  let min = 2
  let max = 100
  let size = min
  document.querySelector('body').appendChild(container)
  container.appendChild(el)
  el.style.fontSize = `${size}pt`
  el.style.width = 'fit-content'
  el.style.whiteSpace = 'nowrap'

  const start = Date.now()
  let count = 0
  while (
    (Math.abs(el.scrollWidth - innerWidth) / innerWidth >
      TOLERANCE &&
      count < 10) ||
    (el.scrollWidth > innerWidth && count < 30)
  ) {
    if (el.scrollWidth < innerWidth) {
      min = size
      size = (max - size) / 2 + size
    } else if (el.scrollWidth > innerWidth) {
      max = size
      size = (min - size) / 2 + size
    }
    el.style.fontSize = `${size}pt`
    el.style.width = 'fit-content'
    el.getBoundingClientRect()
    count++
  }
  el.remove()
  console.log(Date.now() - start)
  return size
}
