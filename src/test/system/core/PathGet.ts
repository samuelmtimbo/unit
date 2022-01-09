import * as assert from 'assert'
import pathGet from '../../../system/core/object/PathGet/f'

assert.deepEqual(pathGet({}, []), {})
assert.deepEqual(pathGet({ a: 1, b: 2 }, []), { a: 1, b: 2 })
assert.deepEqual(pathGet({ a: 1, b: 2 }, ['a']), 1)
assert.deepEqual(pathGet({ a: { aa: 1 }, b: 2 }, ['a', 'aa']), 1)
