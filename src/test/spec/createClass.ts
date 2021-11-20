import * as assert from 'assert'
import { UNTITLED } from '../../constant/STRING'
import { watchGraphAndLog } from '../../debug'
import { fromSpec } from '../../spec/fromSpec'

const Class = fromSpec(
  {
    name: UNTITLED,
    units: {
      add: {
        path: '6fe452f2-2ec1-4ee2-887d-751c3697e6bf',
        input: {
          b: {
            data: '1',
          },
          a: {
            data: '2',
          },
        },
      },
    },
    merges: {},
    inputs: {},
    outputs: {},
  },
  globalThis.__specs
)

const composition = new Class()

composition.play()

false && watchGraphAndLog(composition)

assert.equal(composition.refUnit('add').getOutput('a + b').take(), 3)
