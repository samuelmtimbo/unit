import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { TA } from '../../../../../types/interface/TA'
import { ID_SET_2 } from '../../../../_ids'

export interface I {
  array: TA & $
  data: TA & $
  offset: number
}

export interface O {}

export default class Set2 extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['array', 'data', 'offset'],
        o: [],
      },
      {
        input: {
          array: {
            ref: true,
          },
          data: {
            ref: true,
          },
        },
      },
      system,
      ID_SET_2
    )
  }

  f({ array, data, offset }: I, done: Done<O>) {
    const data_ = data.raw()

    array.set(data_, offset)

    done()
  }
}
