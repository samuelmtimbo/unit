import { lineWrap } from '../../spec/lineWrap'
import assert from '../../util/assert'

assert.deepEqual(lineWrap('default video user media'), [
  'default video',
  'user media',
])
