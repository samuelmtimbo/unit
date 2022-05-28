import { nodeBoot } from '../../client/platform/node/boot'
import { spawn } from '../../spawn'

export const system = nodeBoot()

export const pod = spawn(system)
