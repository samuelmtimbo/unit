import * as assert from 'assert'
import deepGet from '../deepGet'

assert.deepEqual(deepGet({}, []), {})
assert.deepEqual(deepGet({ a: 1, b: 2 }, []), { a: 1, b: 2 })
assert.deepEqual(deepGet({ a: 1, b: 2 }, ['a']), 1)
assert.deepEqual(deepGet({ a: { aa: 1 }, b: 2 }, ['a', 'aa']), 1)
