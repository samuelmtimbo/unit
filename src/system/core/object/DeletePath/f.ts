import { Dict } from '../../../../types/Dict'

export default function dissocPath(
  obj: Dict<any>,
  path: (string | number)[]
): Dict<any> {
  let _obj = Array.isArray(obj) ? [...obj] : { ...obj }
  if (path.length > 1) {
    const [head, ...tail] = path
    _obj[head] = dissocPath(_obj[head] || {}, tail)
  } else if (path.length === 1) {
    const [head] = path
    delete _obj[head]
  }
  return _obj
}

// import assert from 'assert'
// assert.deepEqual(dissocPath({}, []), {})
// assert.deepEqual(dissocPath({ a: 0 }, ['a']), {})
// assert.deepEqual(dissocPath({ a: 0 }, ['b']), { a: 0 })
// assert.deepEqual(dissocPath({ a: { b: 0 } }, ['a']), {})
// assert.deepEqual(dissocPath({ a: { b: 0 } }, ['a', 'b']), { a: {} })
// assert.deepEqual(dissocPath({ a: { b: { c: 1, d: 2 } } }, ['a', 'b', 'c']), {
//   a: { b: { d: 2 } },
// })
