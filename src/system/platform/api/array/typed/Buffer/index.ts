import { Done } from '../../../../../../Class/Functional/Done'
import { Holder } from '../../../../../../Class/Holder'
import { System } from '../../../../../../system'
import { AB } from '../../../../../../types/interface/AB'
import { TA } from '../../../../../../types/interface/TA'
import { wrapArrayBuffer } from '../../../../../../wrap/ArrayBuffer'
import { ID_BUFFER } from '../../../../../_ids'

export interface I {
  from: TA
  any: any
}

export interface O {
  array: AB
}

export default class Buffer_ extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['from', 'any'],
        fo: ['array'],
        i: [],
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
      ID_BUFFER
    )
  }

  f({ from }: I, done: Done<O>) {
    const array_ = from.buffer()

    const array = wrapArrayBuffer(array_, this.__system)

    done({
      array,
    })
  }
}
