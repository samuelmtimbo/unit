import { connectDB } from '../db'
import { connectKV } from '../kv'
import { UserSpec } from '../model/UserSpec'

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
