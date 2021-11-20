import * as assert from 'assert'
import { Pin } from '../Pin'

const pin = new Pin<string>()

assert.equal(pin.take(), undefined)

pin.push('foo')
assert.equal(pin.take(), 'foo')
assert.equal(pin.take(), undefined)

pin.push('bar')
assert.equal(pin.peak(), 'bar')

pin.push('zaz')
assert.equal(pin.peak(), 'zaz')
assert.equal(pin.take(), 'zaz')
