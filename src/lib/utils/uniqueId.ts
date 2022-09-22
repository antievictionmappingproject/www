function* UniqueId(i = 0) {
  while (true) {
    yield i++
  }
}

export const uniqueIdGenerator = UniqueId(0)

export function nextUniqueId() {
  return `uid-${String(uniqueIdGenerator.next().value)}`
}
