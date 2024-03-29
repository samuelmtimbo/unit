import { homedir } from 'os'
import * as path from 'path'

export const PATH_HOME = homedir()
export const PATH_CWD = process.cwd()
export const PATH_UNIT = path.join(__dirname, '..')
export const PATH_PUBLIC = path.join(PATH_UNIT, 'public')
export const PATH_USER = path.join(PATH_UNIT, 'user')
export const PATH_SRC = path.join(PATH_UNIT, 'src')
export const PATH_SRC_ID = path.join(PATH_SRC, 'id')
export const PATH_SRC_CLIENT = path.join(PATH_SRC, 'client')
export const PATH_SRC_SYSTEM = path.join(PATH_SRC, 'system')
export const PATH_SRC_V = path.join(PATH_SRC, 'v.ts')
export const PATH_BUILD = path.join(PATH_UNIT, 'build')
export const PATH_BUILD_CLIENT = path.join(PATH_BUILD, 'client')
export const PATH_SRC_CLIENT_EXTENSION = path.join(PATH_SRC_CLIENT, 'extension')
export const PATH_SRC_CLIENT_EXTENSION_SRC = path.join(
  PATH_SRC_CLIENT_EXTENSION,
  'src'
)
export const PATH_BUILD_SYSTEM = path.join(PATH_BUILD, 'system')
export const PATH_SRC_SYSTEM_PLATFORM = path.join(PATH_SRC_SYSTEM, 'platform')
export const PATH_BUILD_SYSTEM_PLATFORM_COMPONENT = path.join(
  PATH_SRC_SYSTEM_PLATFORM,
  'component'
)
export const PATH_BUILD_SYSTEM_PLATFORM_CORE = path.join(
  PATH_SRC_SYSTEM_PLATFORM,
  'core'
)
export const PATH_BUILD_SYSTEM_PLATFORM_CORE_COMPONENT = path.join(
  PATH_BUILD_SYSTEM_PLATFORM_CORE,
  'component'
)
