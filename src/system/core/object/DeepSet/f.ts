import { Dict } from '../../../../types/Dict'

export default function deepSet(
  obj: Dict<any>,
  path: string[],
  value: any
): any {
  let _obj = { ...obj }
  if (path.length > 0) {
    const [head, ...tail] = path
    _obj[head] = deepSet(_obj[head] || {}, tail, value)
    return _obj
  } else {
    return value
  }
}

// import * as assert from 'assert'
// assert.deepEqual(deepSet({}, [], 0), 0)
// assert.deepEqual(deepSet({}, ['a'], 0), { a: 0 })
// assert.deepEqual(deepSet({}, ['a', 'b'], 0), { a: { b: 0 } })
