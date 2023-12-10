import * as assert from 'assert'
import { $setDatum } from '../../../spec/reducers/data'

assert.deepEqual(
  {
    data0: { value: 'foo' },
    data1: { value: 'bar' },
  },
  $setDatum(
    { id: 'data1', datumSpec: { value: 'bar' } },
    {
      data0: { value: 'foo' },
    }
  ),
  'setDatum'
)
