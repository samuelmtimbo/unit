import { Done } from '../../../../../../Class/Functional/Done'
import { Holder } from '../../../../../../Class/Holder'
import { System } from '../../../../../../system'
import { A } from '../../../../../../types/interface/A'
import { TA } from '../../../../../../types/interface/TA'
import { wrapUint8Array } from '../../../../../../wrap/Array'
import { ID_8BIT_UNSIGNED_CLAMPED_ARRAY } from '../../../../../_ids'

export interface I {
  length: number
  done: any
}

export interface O {
  array: A & TA
  done: any
}

export default class Uint8ClampedArray_ extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['length'],
        fo: ['array'],
        i: [],
        o: ['done'],
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

  b() {
    this._output.done.push(true)
  }
}
