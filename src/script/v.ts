import { writeFileSync } from 'fs'
import { PATH_SRC_V } from '../path'
import { v } from '../v'

writeFileSync(PATH_SRC_V, `export const v: number = ${v + 1}`)
