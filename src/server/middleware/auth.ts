import { Dict } from '../../types/Dict'
import { connectDB } from '../db'
import { connectKV } from '../kv'
import { UserSpec } from '../model/UserSpec'

export async function _user_auth(authToken: string): Promise<UserSpec> {
  return await verifyAuthToken(authToken)
}

export async function verifyAuthToken(
  authToken: string | undefined
): Promise<UserSpec> {
  if (authToken) {
    const kv = await connectKV()
    const db = await connectDB()

    const { authTokenKVStore } = kv
    const { userDB } = db

    const userId = await authTokenKVStore.get(authToken)

    if (userId) {
      const user = await userDB.get(userId)
      return user
    } else {
      throw new Error('invalid token')
    }
  } else {
    throw new Error('invalid token')
  }
}

export function parseCookies(str: string): Dict<string> {
  let rx = /([^;=\s]*)=([^;]*)/g
  let obj = {}
  for (let m; (m = rx.exec(str)); ) obj[m[1]] = decodeURIComponent(m[2])
  return obj
}

export function stringifyCookies(cookies: Dict<string>): string {
  return Object.entries(cookies)
    .map(([k, v]) => k + '=' + encodeURIComponent(v))
    .join('; ')
}
