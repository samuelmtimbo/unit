export function randomId(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 9)
}

export function randomIdNotIn(obj: object) {
  let id: string
  do {
    id = randomId()
  } while (obj[id])
  return id
}

export function randomIdNotInSet(obj: Set<string>) {
  let id: string
  do {
    id = randomId()
  } while (obj.has(id))
  return id
}

export function uuidIdNotInSet(obj: Set<string>) {
  let id: string
  do {
    id = uuid()
  } while (obj.has(id))
  return id
}

export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })
}

export function uuidNotIn(obj: object) {
  let id: string
  do {
    id = uuid()
  } while (obj[id])

  return id
}
