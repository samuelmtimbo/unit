import { Dict } from '../../../../types/Dict'

export default function assocPath(
  obj: Dict<any>,
  path: string[],
  value: any
): any {
  let _obj = { ...obj }
  if (path.length > 0) {
    const [head, ...tail] = path
    _obj[head] = assocPath(_obj[head] || {}, tail, value)
    return _obj
  } else {
    return value
  }
}

// import * as assert from 'assert'
// assert.deepEqual(assocPath({}, [], 0), 0)
// assert.deepEqual(assocPath({}, ['a'], 0), { a: 0 })
// assert.deepEqual(assocPath({}, ['a', 'b'], 0), { a: { b: 0 } })
