import { parseBorder } from '../../client/parseBorder'
import assert from '../../util/assert'

assert.deepEqual(parseBorder(''), {
  width: '0px',
  style: 'solid',
  color: 'currentColor',
})
assert.deepEqual(parseBorder('1px'), {
  width: '1px',
  style: 'solid',
  color: 'currentColor',
})
assert.deepEqual(parseBorder('1px solid white'), {
  width: '1px',
  style: 'solid',
  color: 'white',
})
