import { API } from '../../../../system'

export function webDB(window: Window, prefix: string): API['db'] {
  const db = window.indexedDB

  return db
}
