import {
  ensureDir,
  ensureDirSync,
  pathExists,
  readJSON,
  unlink,
  writeJSON,
} from 'fs-extra'
import * as path from 'path'
import { CloudDB, SharedDB, Store, UserDB } from '.'
import { CWD } from '../../path'
import { UserSpec } from '../model/UserSpec'

const FILESYSTEM_DIR = path.join(CWD, '_unit')
const FILESYSTEM_DIR_DB = path.join(FILESYSTEM_DIR, 'db')
const FILESYSTEM_DIR_DB_CLOUD = path.join(FILESYSTEM_DIR_DB, 'cloud')
const FILESYSTEM_DIR_DB_SHARED = path.join(FILESYSTEM_DIR_DB, 'shared')
const FILESYSTEM_DIR_DB_USER = path.join(FILESYSTEM_DIR_DB, 'user')
const FILESYSTEM_DIR_DB_USER_USER_ID_TO_USER = path.join(
  FILESYSTEM_DIR_DB_USER,
  'user_id_to_user'
)
const FILESYSTEM_DIR_DB_USER_USERNAME_TO_USER_ID = path.join(
  FILESYSTEM_DIR_DB_USER,
  'username_to_user_id'
)

ensureDirSync(FILESYSTEM_DIR)
ensureDirSync(FILESYSTEM_DIR_DB)
ensureDirSync(FILESYSTEM_DIR_DB_USER)
ensureDirSync(FILESYSTEM_DIR_DB_USER_USER_ID_TO_USER)
ensureDirSync(FILESYSTEM_DIR_DB_USER_USERNAME_TO_USER_ID)

export function createFSStore<T>(dir: string, name: string): Store<T> {
  const FILESYSTEM_DIR_TABLE_PATH = path.join(dir, name)

  return {
    get: async function (user_id: string, entry_id: string) {
      ensureDirSync(FILESYSTEM_DIR_TABLE_PATH)

      const user_path = path.join(FILESYSTEM_DIR_TABLE_PATH, user_id)
      const entry_filename = `${entry_id}.json`
      const entry_path = path.join(user_path, entry_filename)
      const entry = await readJSON(entry_path)
      return entry
    },
    getAll: async function (user_id: string) {
      ensureDirSync(FILESYSTEM_DIR_TABLE_PATH)

      const user_array_path = path.join(
        FILESYSTEM_DIR_TABLE_PATH,
        `${user_id}.json`
      )

      if (await pathExists(user_array_path)) {
        const user_array = (await readJSON(user_array_path)) as string[]

        const user_path = path.join(FILESYSTEM_DIR_TABLE_PATH, user_id)

        const all = []

        for (const entry_id of user_array) {
          const entry_filename = `${entry_id}.json`
          const entry_path = path.join(user_path, entry_filename)

          const entry = await readJSON(entry_path)

          all.push(entry)
        }

        return all
      } else {
        return []
      }
    },
    create: async function (user_id: string, entry_id: string, entry: T) {
      ensureDirSync(FILESYSTEM_DIR_TABLE_PATH)

      const user_array_path = path.join(
        FILESYSTEM_DIR_TABLE_PATH,
        `${user_id}.json`
      )

      let user_array = []

      const user_array_path_exists = await pathExists(user_array_path)

      if (user_array_path_exists) {
        user_array = await readJSON(user_array_path)
      }

      user_array.push(entry_id)

      await writeJSON(user_array_path, user_array)

      const user_path = path.join(FILESYSTEM_DIR_TABLE_PATH, user_id)

      await ensureDir(user_path)

      const entry_filename = `${entry_id}.json`
      const entry_path = path.join(user_path, entry_filename)

      await writeJSON(entry_path, entry)

      return entry
    },
    delete: async function (user_id: string, index_str: string) {
      const user_array_path = path.join(
        FILESYSTEM_DIR_TABLE_PATH,
        `${user_id}.json`
      )

      const user_array_path_exists = await pathExists(user_array_path)

      if (user_array_path_exists) {
        const user_array = await readJSON(user_array_path)

        const entry_index = Number.parseInt(index_str)

        const entry_id = user_array[entry_index]

        if (entry_index > -1) {
          user_array.splice(entry_index, 1)

          await writeJSON(user_array_path, user_array)

          const user_path = path.join(FILESYSTEM_DIR_TABLE_PATH, user_id)
          const entry_filename = `${entry_id}.json`
          const entry_path = path.join(user_path, entry_filename)

          await unlink(entry_path)

          return
        } else {
          throw new Error('entry not found')
        }
      } else {
        throw new Error('entry not found')
      }
    },
    put: async function (user_id: string, entry_id: string, entry: T) {
      const user_path = path.join(FILESYSTEM_DIR_TABLE_PATH, user_id)
      const entry_filename = `${entry_id}.json`
      const entry_path = path.join(user_path, entry_filename)
      await writeJSON(entry_path, entry)
      return entry
    },
  }
}

export const FSUserDB: UserDB = {
  get: async function (user_id: string) {
    const user_id_filename = `${user_id}.json`

    ensureDirSync(FILESYSTEM_DIR_DB_USER_USER_ID_TO_USER)

    const user_path = path.join(
      FILESYSTEM_DIR_DB_USER_USER_ID_TO_USER,
      user_id_filename
    )
    if (await pathExists(user_path)) {
      const user = await readJSON(user_path)
      return user
    } else {
      return null
    }
  },
  create: async function (user: UserSpec) {
    const { userId: pbkey } = user
    const user_id_filename = `${pbkey}.json`

    ensureDirSync(FILESYSTEM_DIR_DB_USER_USER_ID_TO_USER)

    const user_path = path.join(
      FILESYSTEM_DIR_DB_USER_USER_ID_TO_USER,
      user_id_filename
    )

    // TODO error handling (with rollback)
    await writeJSON(user_path, user)

    return user
  },
  patch: async function (user_id: string, partial: Partial<UserSpec>) {
    const user = await FSUserDB.get(user_id)
    const patched = { ...user, ...partial }
    return FSUserDB.create(patched)
  },
}

export const FSCloudDB: CloudDB = {
  graph: createFSStore(FILESYSTEM_DIR_DB_CLOUD, 'graph'),
  web: createFSStore(FILESYSTEM_DIR_DB_CLOUD, 'web'),
  vm: createFSStore(FILESYSTEM_DIR_DB_CLOUD, 'vm'),
  token: createFSStore(FILESYSTEM_DIR_DB_CLOUD, 'token'),
}

export const FSSharedDB: SharedDB = {
  graph: createFSStore(FILESYSTEM_DIR_DB_SHARED, 'graph'),
  web: createFSStore(FILESYSTEM_DIR_DB_SHARED, 'web'),
  vm: createFSStore(FILESYSTEM_DIR_DB_SHARED, 'vm'),
  token: createFSStore(FILESYSTEM_DIR_DB_SHARED, 'token'),
}
