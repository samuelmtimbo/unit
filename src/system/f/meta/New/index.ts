import { Semifunctional } from '../../../../Class/Semifunctional'
import { Unit } from '../../../../Class/Unit'
import { System } from '../../../../system'
import { UnitBundle } from '../../../../types/UnitBundle'
import { ID_NEW } from '../../../_ids'

export interface I<T> {
  class: UnitBundle<any>
  done: any
}

export interface O<T> {
  unit: Unit<any, any>
}

export default class New<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['class'],
        fo: ['unit'],
        i: ['done'],
      },
      {
        output: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_NEW
    )
  }

  f({ class: Class }: I<T>, done): void {
    done({ unit: new Class(this.__system) })
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._forward_all_empty()
    this._backward('class')
    this._backward('done')
    // }
  }
}
