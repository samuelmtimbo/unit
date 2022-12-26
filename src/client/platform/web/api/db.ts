import { API, BootOpt } from '../../../../system'

export function webDB(window: Window, opt: BootOpt): API['db'] {
  const db = window.indexedDB

  return db
}
