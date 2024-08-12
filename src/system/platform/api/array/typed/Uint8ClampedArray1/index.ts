import { Done } from '../../../../../../Class/Functional/Done'
import { Holder } from '../../../../../../Class/Holder'
import { System } from '../../../../../../system'
import { A } from '../../../../../../types/interface/A'
import { AB } from '../../../../../../types/interface/AB'
import { TA } from '../../../../../../types/interface/TA'
import { wrapUint8Array } from '../../../../../../wrap/Array'
import { ID_8BIT_UNSIGNED_CLAMPED_ARRAY_1 } from '../../../../../_ids'

export interface I {
  init: AB
  done: any
}

export interface O {
  array: A & TA
}

export default class Uint8ClampedArray1 extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['init'],
        fo: ['array'],
        i: [],
        o: [],
      },
      {
        input: {
          init: {
            ref: true,
          },
        },
        output: {
          array: {
            ref: true,
          },
        },
      },
      system,
      ID_8BIT_UNSIGNED_CLAMPED_ARRAY_1
    )
  }

  async f({ init }: I, done: Done<O>) {
    const init_ = await init.arrayBuffer()

    const _array = new Uint8ClampedArray(init_)

    const array = wrapUint8Array(_array, this.__system)

    done({
      array,
    })
  }
}
