import { watchUnitAndLog } from '../../../../debug'
import DeepMerge from '../../../../system/f/object/DeepMerge'
import { testMIMO } from '../../../util'

const deepMerge = new DeepMerge()

deepMerge.play()

false && watchUnitAndLog(deepMerge)

testMIMO(deepMerge, { a: {}, b: {} }, { ab: {} })
testMIMO(deepMerge, { a: { a: 1 }, b: { b: 2 } }, { ab: { a: 1, b: 2 } })
testMIMO(
  deepMerge,
  { a: { a: 1, b: {} }, b: { b: {} } },
  { ab: { a: 1, b: {} } }
)
testMIMO(
  deepMerge,
  { a: { a: 1, b: 1, c: { foo: [1], bar: 0 } }, b: { b: 2, c: {} } },
  {
    ab: {
      a: 1,
      b: 2,
      c: { foo: [1], bar: 0 },
    },
  }
)
testMIMO(
  deepMerge,
  {
    a: { a: 1, b: 1, c: { foo: [1], bar: 0 } },
    b: { b: 2, c: { foo: 'bar' } },
  },
  {
    ab: {
      a: 1,
      b: 2,
      c: { foo: 'bar', bar: 0 },
    },
  }
)
