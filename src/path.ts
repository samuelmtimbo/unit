import { homedir } from 'os'
import * as path from 'path'

export const PATH_HOME = homedir()

export const CWD = process.cwd()

export const PATH_PUBLIC = path.join(CWD, 'public')

export const PATH_SRC = path.join(CWD, 'src')
export const PATH_SRC_ID = path.join(PATH_SRC, 'id')
export const PATH_SRC_CLIENT = path.join(PATH_SRC, 'client')
export const PATH_SRC_SYSTEM = path.join(PATH_SRC, 'system')
export const PATH_SRC_V = path.join(PATH_SRC, 'v.ts')

export const PATH_BUILD = path.join(CWD, 'build')
export const PATH_BUILD_CLIENT = path.join(PATH_BUILD, 'client')
export const PATH_BUILD_SYSTEM = path.join(PATH_BUILD, 'system')
