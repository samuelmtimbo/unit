import * as assert from 'assert'
import { setDatum } from '../../../spec/reducers/data'

// setDatum

assert.deepEqual(
  {
    data0: 'foo',
    data1: 'bar',
  },
  setDatum(
    { id: 'data1', value: 'bar' },
    {
      data0: 'foo',
    }
  ),
  'setDatum'
)
