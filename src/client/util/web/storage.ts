import { keys } from '../../../system/f/object/Keys/f'
import { Dict } from '../../../types/Dict'
import { IStorage } from '../../../types/global/IStorage'

export function storageHasKey(storage: IStorage, key: string): boolean {
  const item = storage.getItem(key)
  const has = !!item
  return has
}

export function getStorageKeys(storage: IStorage): string[] {
  return keys(storage)
}

export function getAllStorage(storage: IStorage): Dict<string> {
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

export function deleteAllStorage(storage: IStorage): void {
  storage.clear()
}

export function deleteAllLocalStorage(): void {
  deleteAllStorage(localStorage)
}

export function deleteAllSessionStorage(): void {
  deleteAllStorage(sessionStorage)
}
