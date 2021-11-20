import * as assert from 'assert'
import _propPath from '../../../system/core/object/PropPath/f'

assert.deepEqual(_propPath({}, []), {})
assert.deepEqual(_propPath({ a: 1, b: 2 }, []), { a: 1, b: 2 })
assert.deepEqual(_propPath({ a: 1, b: 2 }, ['a']), 1)
assert.deepEqual(_propPath({ a: { aa: 1 }, b: 2 }, ['a', 'aa']), 1)
