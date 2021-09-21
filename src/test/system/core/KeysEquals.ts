import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { GraphSpec } from '../../../types'
const spec =
  require('../../../system/core/common/KeysEquals/spec.json') as GraphSpec

// console.log(JSON.stringify(spec, null, 2))

const KeysEquals = fromSpec<{ a: object; keys: string[] }, { equals: boolean }>(
  spec,
  globalThis.__specs
)

const keysEquals = new KeysEquals()

false && watchUnitAndLog(keysEquals)
false && watchGraphAndLog(keysEquals)

// do not forget to play
keysEquals.play()

keysEquals.push('a', {})
keysEquals.push('keys', [])
assert.equal(keysEquals.take('equals'), true)
assert.equal(keysEquals.take('equals'), undefined)

keysEquals.push('a', { foo: 'bar' })
keysEquals.push('keys', ['foo'])
assert.equal(keysEquals.take('equals'), true)
assert.equal(keysEquals.take('equals'), undefined)
