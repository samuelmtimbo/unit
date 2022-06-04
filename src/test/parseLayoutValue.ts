import { parseLayoutValue } from '../client/parseLayoutValue'
import assert from '../util/assert'

assert.deepEqual(parseLayoutValue('calc(50% + 2.4px)'), [2.4, 50])
