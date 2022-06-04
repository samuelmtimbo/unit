import { System } from '../system'
import { Dict } from '../types/Dict'
import { connect, DATABASE_NAME } from './database'

export interface Entry<T> {
  id: string
  createdAt: string
  updatedAt: string
  data: T
}

export interface Store<T> {
  get: (id: string) => Promise<T | null>
  getAll: () => Promise<Dict<T>>
  add: (id: string, data: T) => Promise<T>
  addAll: (data: T[]) => Promise<void>
  put: (id: string, data: T) => Promise<T>
  delete: (id: string) => Promise<void>
  clear: () => Promise<any>
  reset: (data: T[]) => Promise<any>
}

export const SYSTEM_DATABASE_VERSION_KEY = 'SYSTEM_DATABASE_VERSION_KEY'

export class LocalStore<T> implements Store<T> {
  private _system: System
  private _name: string

  constructor(system: System, name: string) {
    this._system = system
    this._name = name
  }

  private _db = (): Promise<IDBDatabase> => {
    return connect(this._system, DATABASE_NAME, undefined).then((db) => {
      if (db.objectStoreNames.contains(this._name)) {
        return db
      } else {
        let db_version: number
        const db_version_str: string | null = localStorage.getItem(
          SYSTEM_DATABASE_VERSION_KEY
        )
        if (db_version_str === null) {
          db_version = db.version
        } else {
          db_version = Number.parseInt(db_version_str)
        }
        db_version++
        localStorage.setItem(SYSTEM_DATABASE_VERSION_KEY, `${db_version}`)
        return connect(this._system, DATABASE_NAME, db_version, (db) => {
          if (!db.objectStoreNames.contains(this._name)) {
            db.createObjectStore(this._name, {})
          }
        })
      }
    })
  }

  private _store = (
    mode?: 'readonly' | 'readwrite' | 'versionchange' | undefined
  ): Promise<IDBObjectStore> => {
    return this._db().then((db) => {
      const transaction = db.transaction(this._name, mode)
      const idb_store = transaction.objectStore(this._name)
      return idb_store
    })
  }

  private _promisify_request<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = (event: Event) => {
        const result: T = (event.target as IDBRequest<T>).result
        resolve(result)
      }
      request.onerror = (event) => {
        // @ts-ignore
        reject(event.target.errorCode)
      }
    })
  }

  async get(id: string): Promise<T | null> {
    const store = await this._store('readonly')
    const request: IDBRequest<T | null> = store.get(id)
    const entry = await this._promisify_request(request)
    return entry
  }

  async getAll(): Promise<Dict<T>> {
    return new Promise(async (resolve, reject) => {
      let store

      try {
        store = await this._store('readonly')
      } catch (err) {
        reject(err)

        return
      }

      const all: Dict<T> = {}

      const request: IDBRequest<IDBCursorWithValue | null> = store.openCursor()

      request.onsuccess = (event: Event) => {
        const cursor: IDBCursorWithValue | null = (
          event.target as IDBRequest<IDBCursorWithValue | null>
        ).result

        if (cursor) {
          const { key, value } = cursor

          all[key.toString()] = value

          cursor.continue()
        } else {
          resolve(all)
        }
      }
      request.onerror = (event) => {
        // @ts-ignore
        reject(event.target.errorCode)
      }
    })
  }

  async reset(data: T[]): Promise<any> {
    const store = await this._store('readwrite')
    const promise = this._clear(store).then(() => this._addAll(store, data))
    return promise
  }

  async clear(): Promise<void> {
    const store = await this._store('readonly')
    return this._clear(store)
  }

  private async _clear(store: IDBObjectStore): Promise<void> {
    const request: IDBRequest<undefined> = store.clear()
    return this._promisify_request(request)
  }

  async add(id: string, data: T): Promise<T> {
    const store = await this._store('readwrite')
    const request: IDBRequest<IDBValidKey> = store.add(data, id)
    await this._promisify_request(request)
    return data
  }

  async addAll(data: T[]): Promise<any> {
    const store = await this._store('readwrite')
    return this._addAll(store, data)
  }

  private async _addAll(store: IDBObjectStore, data: T[]): Promise<any> {
    const all = []
    for (const id in data) {
      const entry = data[id]
      const request: IDBRequest<IDBValidKey> = store.add(entry, id)
      const request_promise = this._promisify_request(request)
      all.push(request_promise)
    }
    return Promise.all(all)
  }

  async put(id: string, data: T): Promise<T> {
    const store = await this._store('readwrite')
    const request: IDBRequest<IDBValidKey> = store.put(data, id)
    const entry = await this._promisify_request(request)
    return data
  }

  async delete(id: string): Promise<void> {
    const store = await this._store('readwrite')
    const request: IDBRequest<undefined> = store.delete(id)
    await this._promisify_request(request)
  }
}
