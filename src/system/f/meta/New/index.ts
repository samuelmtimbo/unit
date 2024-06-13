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
  private _unit: Unit

  constructor(system: System) {
    super(
      {
        fi: ['class'],
        fo: ['unit'],
        i: ['done'],
        o: ['done'],
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
    const unit = new Class(this.__system)

    this._unit = unit

    done({ unit })
  }

  d() {
    if (this._unit) {
      this._unit.destroy()

      this._unit = undefined
    }
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._forward_all_empty()

    this._backward('class')

    this._backward('done')
    // }
  }
}
