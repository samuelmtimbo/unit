import { writeFileSync } from 'fs'
import { PATH_SRC_V } from './path'
import { v } from './v'

const _v = `${v + 1}`

writeFileSync(PATH_SRC_V, _v)
