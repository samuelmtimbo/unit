import { boot } from '../../boot'
import { spawn } from '../../spawn'
import _classes from '../../system/_classes'
import _specs from '../../system/_specs'

export const system = boot({ specs: _specs, classes: _classes })

export const pod = spawn(system)
