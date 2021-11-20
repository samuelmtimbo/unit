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

export type UserDB = {
  create: (user: UserSpec) => Promise<UserSpec>
  patch: (userId: string, partial: Partial<UserSpec>) => Promise<UserSpec>
  get(userId: string): Promise<UserSpec | null>
  getByEmail(email: string): Promise<UserSpec | null>
  getByUsername(username: string): Promise<UserSpec | null>
}

// removeEmailFilter("foo+0@example.com") === "foo@example.com"
export function removeEmailFilter(email: string): string {
  const _email = email.replace(/(\+.*)(?=\@)/, '')
  return _email
}

export async function getUserByEmail(email: string): Promise<UserSpec> {
  const _email = removeEmailFilter(email)
  const db = await connectDB()
  const { userDB } = db
  const user = await userDB.getByEmail(_email)
  return user
}
