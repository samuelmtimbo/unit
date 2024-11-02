import { render } from './render'

import bundle = require('./bundle.json')
import system = require('./system.json')

// @ts-ignore
render(bundle, system)
