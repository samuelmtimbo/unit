import { Done } from '../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../Class/Semifunctional'
import { System } from '../../../../system'
import { A } from '../../../../types/interface/A'
import { TA } from '../../../../types/interface/TA'
import { wrapUint8Array } from '../../../../wrap/Array'
import { ID_8BIT_UNSIGNED_CLAMPED_ARRAY } from '../../../_ids'

export interface I {
  length: number
  done: any
}

export interface O {
  array: A & TA
}

export default class Uint8ClampedArray_ extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['length'],
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
      ID_8BIT_UNSIGNED_CLAMPED_ARRAY
    )
  }

  f({ length }: I, done: Done<O>) {
    const _array = new Uint8ClampedArray(length)

    const array = wrapUint8Array(_array, this.__system)

    done({
      array,
    })
  }

  public onIterDataInputData(name: string, data: any): void {
    if (name === 'done') {
      this._forward_all_empty()

      this._backward('length')

      this._backward('done')
    }
  }
}
