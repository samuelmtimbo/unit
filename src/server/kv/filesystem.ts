import {
  ensureDirSync,
  pathExists,
  readJSON,
  unlink,
  writeJSON,
} from 'fs-extra'
import * as path from 'path'
import { CloudKV, KVStore } from '.'
import { PATH_HOME } from '../../path'

const FILESYSTEM_DIR = path.join(PATH_HOME, '_unit')
const FILESYSTEM_DIR_KV = path.join(FILESYSTEM_DIR, 'kv')

ensureDirSync(FILESYSTEM_DIR)
ensureDirSync(FILESYSTEM_DIR_KV)

export const makeFSKVStore = (cwd: string, name: string): KVStore<any> => {
  const FILESYSTEM_DIR_KV_STORE = path.join(cwd, name)

  return {
    get: async (key: string) => {
      ensureDirSync(FILESYSTEM_DIR_KV_STORE)
      const value_filename = path.join(FILESYSTEM_DIR_KV_STORE, `${key}.json`)
      if (await pathExists(value_filename)) {
        const value = await readJSON(value_filename)
        return value
      } else {
        return null
      }
    },
    set: async (key: string, value: any) => {
      ensureDirSync(FILESYSTEM_DIR_KV_STORE)
      const value_filename = path.join(FILESYSTEM_DIR_KV_STORE, `${key}.json`)
      await writeJSON(value_filename, value)
      return Promise.resolve()
    },
    delete: async (key: string) => {
      ensureDirSync(FILESYSTEM_DIR_KV_STORE)
      const value_filename = path.join(FILESYSTEM_DIR_KV_STORE, `${key}.json`)
      if (await pathExists(value_filename)) {
        await unlink(value_filename)
      }
    },
  }
}

export const FSKV: CloudKV = {
  authTokenKVStore: makeFSKVStore(FILESYSTEM_DIR_KV, 'authToken'),
}
