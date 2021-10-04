import NOOP from '../NOOP'

export const DATABASE_NAME: string = 'unit'
export const DATABASE_VERSION: number = 1

export async function connect(
  name: string,
  version: number,
  onupgradeneeded: (db: IDBDatabase) => void = NOOP
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = window.indexedDB.open(name, version)
    request.onerror = (event: Event) => {
      reject(
        // @ts-ignore
        new Error('Could not connect to IndexedDB: ' + event.target.errorCode)
      )
    }

    request.onsuccess = (event: Event) => {
      if (event && event.target) {
        const db = (event.target as IDBOpenDBRequest).result
        resolve(db)
      }
    }

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase
      onupgradeneeded(db)
    }
  })
}
