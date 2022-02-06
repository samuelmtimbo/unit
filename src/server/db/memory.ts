import { CloudDB, SharedDB, Store, UserDB } from '.'
import { Dict } from '../../types/Dict'
import { clone } from '../../util/object'
import { UserSpec } from '../model/UserSpec'

const DATA_PBKEY_TO_USER: Dict<UserSpec> = {}

const DATA_CLOUD: Dict<Dict<any[]>> = {}

export const DATA_SHARED: Dict<Dict<any[]>> = {}

export function createMemoryStore<T>(
  name: string,
  DATA: Dict<Dict<any[]>>
): Store<T> {
  let table = DATA[name] || {}

  return {
    get: (userId: string, id: string) => {
      const user = table[userId] || {}
      const entry = user[id]
      return Promise.resolve(entry)
    },
    getAll: (userId: string) => {
      const user = table[userId] || []
      return Promise.resolve(user)
    },
    create: (userId: string, id: string, entry: T) => {
      if (table === undefined) {
        table = {}
        DATA[name] = table
      }
      let user = table[userId]
      if (user === undefined) {
        user = []
        table[userId] = user
      }
      user.push(entry)
      return Promise.resolve(entry)
    },
    delete: (userId: string, id: string) => {
      let user = table[userId]

      const index = Number.parseInt(id)

      user.splice(index, 1)

      return Promise.resolve()
    },
    put: (userId: string, id: string, entry: T) => {
      let user = table[userId]
      user[id] = entry
      return Promise.resolve(entry)
    },
  }
}

export const memoryUserDB: UserDB = {
  get: (userId: string) => {
    const user = clone(DATA_PBKEY_TO_USER[userId] || null)
    return Promise.resolve(user)
  },
  create: (user: UserSpec) => {
    const { userId: pbkey } = user
    DATA_PBKEY_TO_USER[pbkey] = user
    return Promise.resolve(user)
  },
  patch: async function (user_id: string, partial: Partial<UserSpec>) {
    const user = await this.get(user_id)
    const patched = { ...user, ...partial }
    return this.create(patched)
  },
}

export const memoryCloudDB: CloudDB = {
  graph: createMemoryStore('graph', DATA_CLOUD),
  web: createMemoryStore('web', DATA_CLOUD),
  vm: createMemoryStore('vm', DATA_CLOUD),
}

export const memorySharedDB: SharedDB = {
  graph: createMemoryStore('graph', DATA_SHARED),
  web: createMemoryStore('web', DATA_SHARED),
  vm: createMemoryStore('vm', DATA_SHARED),
}
