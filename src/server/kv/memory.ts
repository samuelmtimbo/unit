import { CloudKV, KVStore } from '.'

export const data = {
  authToken: {},
}

export const makeMemoryKVStore = (name: string): KVStore<any> => {
  return {
    get: (key: string) => {
      return Promise.resolve(data[name][key])
    },
    set: (key: string, value: any) => {
      data[name][key] = value
      return Promise.resolve()
    },
    delete: (key: string) => {
      delete data[name][key]
      return Promise.resolve()
    },
  }
}

export const memoryKV: CloudKV = {
  authTokenKVStore: makeMemoryKVStore('authToken'),
}
