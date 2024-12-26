import { keys as keys__ } from '../../system/f/object/Keys/f'
import { Dict } from '../../types/Dict'

export function safePath(path: string): string {
  return `${path}/`
}

export function prependPath(path: string, key: string): string {
  return `${safePath(path)}${key}`
}

export function shiftPath(path: string, key: string): string {
  return key.slice(path.length + 1)
}

export function hasKey(storage: Storage, path: string, key: string): boolean {
  const key_ = prependPath(path, key)

  const item = storage.getItem(key_)

  const has = !!item

  return has
}

export function keys(storage: Storage, path: string): string[] {
  const path_ = safePath(path)

  const allKeys = keys__(storage)

  const keys = []

  for (const key of allKeys) {
    if (key.startsWith(path_)) {
      const relativeKey = shiftPath(path, key)

      keys.push(relativeKey)
    }
  }

  return keys
}

export function read(storage: Storage, path: string): Dict<string> {
  const obj: Dict<string> = {}

  const keys_ = keys(storage, path)

  for (const key of keys_) {
    const _key = `${path}${key}`

    obj[key] = storage.getItem(_key)
  }

  return obj
}

export function get(storage: Storage, path: string, name: string): string {
  const key = prependPath(path, name)

  const value = storage.getItem(key)

  if (value === null) {
    throw new Error('key not found')
  } else {
    return value
  }
}

export function set(
  storage: Storage,
  path: string,
  name: string,
  value: string
): void {
  const key = prependPath(path, name)

  storage.setItem(key, value)
}

export function delete_(storage: Storage, path: string, name: string): void {
  const key = prependPath(path, name)

  storage.removeItem(key)
}

export function write(storage: Storage, path: string, obj: Dict<string>): void {
  const keys_ = keys(storage, path)

  for (const key of keys_) {
    storage.removeItem(key)
  }

  for (const key in obj) {
    set(storage, path, key, obj[key])
  }
}
