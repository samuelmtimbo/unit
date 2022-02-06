import { Dict } from '../../types/Dict'
import { UserSpec } from '../model/UserSpec'
import { FSCloudDB, FSSharedDB, FSUserDB } from './filesystem'

export async function connectDB(): Promise<DB> {
  return {
    // userDB: memoryUserDB,
    // cloudDB: memoryCloudDB,
    // sharedDB: memorySharedDB,
    userDB: FSUserDB,
    cloudDB: FSCloudDB,
    sharedDB: FSSharedDB,
  }
}

export type DB = {
  userDB: UserDB
  cloudDB: CloudDB
  sharedDB: SharedDB
}

export type Store<T> = {
  create: (userId: string, id: string, entry: T) => Promise<T>
  get: (userId: string, id: string) => Promise<T>
  getAll: (userId: string) => Promise<T[]>
  put: (userId: string, id: string, entry: T) => Promise<T>
  delete: (userId: string, id: string) => Promise<void>
}

export type EntrySpec<T> = T

export type SharedEntrySpec = {
  userId: string
  entryId: string
}

export type CloudDB = Dict<Store<EntrySpec<any>>>
export type SharedDB = Dict<Store<SharedEntrySpec>>

export type UserDB<T = UserSpec> = {
  create: (user: T) => Promise<T>
  patch: (pbKey: string, partial: Partial<T>) => Promise<T>
  get(pbKey: string): Promise<T | null>
}
