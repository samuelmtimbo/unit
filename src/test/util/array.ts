import * as assert from 'assert'
import { rotate } from '../../util/array'

assert.deepEqual(rotate([1, 2, 3], 1), [2, 3, 1])
