import { Dict } from '../../../types/Dict'

export function storageHasKey(storage: Storage, key: string): boolean {
  const item = storage.getItem(key)
  const has = !!item
  return has
}

export function getStorageKeys(storage: Storage): string[] {
  const keys = Object.keys(storage)
  return keys
}

export function getAllStorage(storage: Storage): Dict<string> {
  const obj: Dict<string> = {}
  const keys = getStorageKeys(storage)
  for (const key of keys) {
    obj[key] = storage.getItem(key)
  }
  return obj
}

export function getAllLocalStorage(): Dict<string> {
  return getAllStorage(localStorage)
}

export function getAllSessionStorage(): Dict<string> {
  return getAllStorage(sessionStorage)
}

export function deleteAllStorage(storage: Storage): void {
  storage.clear()
}

export function deleteAllLocalStorage(): void {
  deleteAllStorage(localStorage)
}

export function deleteAllSessionStorage(): void {
  deleteAllStorage(sessionStorage)
}
