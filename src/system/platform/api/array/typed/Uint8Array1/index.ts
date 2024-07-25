import { Done } from '../../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../../Class/Semifunctional'
import { System } from '../../../../../../system'
import { A } from '../../../../../../types/interface/A'
import { AB } from '../../../../../../types/interface/AB'
import { TA } from '../../../../../../types/interface/TA'
import { V } from '../../../../../../types/interface/V'
import { wrapUint8Array } from '../../../../../../wrap/Array'
import { ID_8BIT_UNSIGNED_ARRAY_0 } from '../../../../../_ids'

export interface I {
  init: AB
  done: any
}

export interface O {
  array: V & A & TA
}

export default class Uint8Array1 extends Semifunctional<I, O> {
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
          init: {
            ref: true,
          },
          array: {
            ref: true,
          },
        },
      },
      system,
      ID_8BIT_UNSIGNED_ARRAY_0
    )
  }

  async f({ init }: I, done: Done<O>) {
    const init_ = await init.arrayBuffer()

    const array_ = new Uint8Array(init_)

    const array = wrapUint8Array(array_, this.__system)

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
