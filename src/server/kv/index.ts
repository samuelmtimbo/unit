import { Dict } from '../../types/Dict'
import { FSKV } from './filesystem'

export type KVStore<T> = {
  get(key: string): Promise<T | null>
  set(key: string, value: T): Promise<void>
  delete(key: string): Promise<void>
}

export type KV = Dict<KVStore<any>>

export type AuthTokenKVStore = KVStore<string>

export type CloudKV = {
  authTokenKVStore: AuthTokenKVStore
}

export const connectKV: () => Promise<CloudKV> = () => {
  // return Promise.resolve(memoryKV)
  return Promise.resolve(FSKV)
}
