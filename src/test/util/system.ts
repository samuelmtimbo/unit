import { boot } from '../../boot'
import { spawn } from '../../spawn'

export const system = boot()

export const pod = spawn(system)
