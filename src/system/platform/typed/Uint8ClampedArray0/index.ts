import { Done } from '../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../Class/Semifunctional'
import { System } from '../../../../system'
import { A } from '../../../../types/interface/A'
import { TA } from '../../../../types/interface/TA'
import { wrapUint8Array } from '../../../../wrap/Array'
import { ID_8BIT_UNSIGNED_CLAMPED_ARRAY_0 } from '../../../_ids'

export interface I {
  init: number[]
  done: any
}

export interface O {
  array: A & TA
}

export default class Uint8ClampedArray0 extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['init'],
        fo: ['array'],
        i: ['done'],
        o: [],
      },
      {
        output: {
          array: {
            ref: true,
          },
        },
      },
      system,
      ID_8BIT_UNSIGNED_CLAMPED_ARRAY_0
    )
  }

  f({ init }: I, done: Done<O>) {
    const _array = new Uint8ClampedArray(init)

    const array = wrapUint8Array(_array, this.__system)

    done({
      array,
    })
  }

  public onIterDataInputData(name: string, data: any): void {
    if (name === 'done') {
      this._forward_all_empty()

      this._backward('init')

      this._backward('done')
    }
  }
}
