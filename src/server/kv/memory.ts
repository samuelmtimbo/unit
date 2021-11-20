import { CloudKV, KVStore } from '.'

export const data = {
  emailToken: {},
  authToken: {},
  signUpToken: {},
  PRCodeKVStore: {},
  PRTokenKVStore: {},
  PCCodeKVStore: {},
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
  signUpCodeKVStore: makeMemoryKVStore('emailToken'),
  signUpTokenKVStore: makeMemoryKVStore('signUpToken'),
  PRCodeKVStore: makeMemoryKVStore('PRCodeKVStore'),
  PRTokenKVStore: makeMemoryKVStore('PRTokenKVStore'),
  PCCodeKVStore: makeMemoryKVStore('PCCodeKVStore'),
}
