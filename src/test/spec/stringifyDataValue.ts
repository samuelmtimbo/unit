import { stringifyDataValue } from '../../spec/stringifyDataValue'
import _classes from '../../system/_classes'
import _specs from '../../system/_specs'
import { assert } from '../../util/assert'

assert.equal(stringifyDataValue('"foo"', _specs, _classes), '"foo"')
assert.equal(
  stringifyDataValue({ ref: [], data: '"foo"' }, _specs, _classes),
  `"\\"foo\\""`
)
assert.equal(
  stringifyDataValue({ ref: [], data: false }, _specs, _classes),
  'false'
)
assert.equal(
  stringifyDataValue(
    {
      ref: [[]],
      data: { unit: { id: '260d774e-bc89-4027-aa92-cb1985fb312b' } },
    },
    _specs,
    _classes
  ),
  '${"unit":{"id":"260d774e-bc89-4027-aa92-cb1985fb312b"}}'
)
