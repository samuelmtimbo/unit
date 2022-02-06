import assert from '../../../../../util/assert'
import { line_wrap } from './Component'

assert.deepEqual(line_wrap('default video user media'), [
  'default video',
  'user media',
])
