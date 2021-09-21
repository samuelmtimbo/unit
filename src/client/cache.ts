export const SEPARATOR = '/'

export function getKey(path: string[]): string {
  const key = path.map(btoa).join(SEPARATOR)
  return key
}

export function setItem<T>(path: string[], value: T): void {
  const key = getKey(path)
  const item = JSON.stringify(value)
  localStorage.setItem(key, item)
}

export function getItem<T>(path: string[]): T | null {
  const key = getKey(path)
  const item = localStorage.getItem(key)
  if (item !== undefined && item !== null) {
    return JSON.parse(item)
  } else {
    return null
  }
}

export function getAll<T>(id: string): { [key: string]: T } {
  const all = {}
  const start = `${btoa(id)}/`
  const startLength = start.length
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(start)) {
      const item = localStorage.getItem(key)
      const k = key.slice(startLength)
      if (item) {
        all[atob(k)] = JSON.parse(item)
      }
    }
  }
  return all
}

export class Cache<T> {
  private _id: string

  constructor(id: string) {
    this._id = id
  }

  private _key = (path: string): string[] => {
    return [this._id].concat([path])
  }

  getItem(path: string): T | null {
    return getItem<T>(this._key(path))
  }

  setItem(path: string, value: T): void {
    return setItem(this._key(path), value)
  }

  getAll(): { [key: string]: T } {
    return getAll(this._id)
  }
}
