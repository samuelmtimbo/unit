import { Dict } from '../../types/Dict'
import { FSKV } from './filesystem'

export type KVStore<T> = {
  get(key: string): Promise<T | null>
  set(key: string, value: T): Promise<void>
  delete(key: string): Promise<void>
}

export type KV = Dict<KVStore<any>>

export const connectKV: () => Promise<CloudKV> = () => {
  // return Promise.resolve(memoryKV)
  return Promise.resolve(FSKV)
}

export type AuthTokenKVStore = KVStore<string>
export type SignUpCodeKVStore = KVStore<string>
export type SignUpTokenKVStore = KVStore<string>

export type CloudKV = {
  authTokenKVStore: AuthTokenKVStore
  signUpCodeKVStore: SignUpCodeKVStore
  signUpTokenKVStore: SignUpTokenKVStore
  PRCodeKVStore: KVStore<string>
  PRTokenKVStore: KVStore<string>
  PCCodeKVStore: KVStore<string>
}
