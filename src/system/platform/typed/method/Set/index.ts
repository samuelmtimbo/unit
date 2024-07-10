import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { TA } from '../../../../../types/interface/CLA'
import { ID_SET_2 } from '../../../../_ids'

export interface I {
  array: TA & $
  buffer: TA & $
  offset: number
}

export interface O {}

export default class Set2 extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['array', 'buffer', 'offset'],
        o: [],
      },
      {
        input: {
          array: {
            ref: true,
          },
          buffer: {
            ref: true,
          },
        },
      },
      system,
      ID_SET_2
    )
  }

  f({ array, buffer, offset }: I, done: Done<O>) {
    const buffer_ = buffer.raw()

    array.set(buffer_, offset)

    done()
  }
}
