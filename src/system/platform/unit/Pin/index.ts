import { $ } from '../../../../Class/$'
import { Done } from '../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../Class/Semifunctional'
import { System } from '../../../../system'
import { IO } from '../../../../types/IO'
import { PI } from '../../../../types/interface/PI'
import { U } from '../../../../types/interface/U'
import { V } from '../../../../types/interface/V'
import { ID_PIN } from '../../../_ids'

export interface I<T> {
  unit: U
  name: string
  type: IO
  done: T
}

export interface O<T> {
  pin: V & PI<any> & $
}

export default class Pin_<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['unit', 'name', 'type'],
        fo: ['pin'],
        i: ['done'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
        output: {
          pin: {
            ref: true,
          },
        },
      },
      system,
      ID_PIN
    )
  }

  async f({ unit, name, type }: I<T>, done: Done<O<T>>) {
    try {
      const pin = unit.getPin(type, name)

      done({ pin })
    } catch (err) {
      done(undefined, err.message)
    }
  }

  onIterDataInputData(name: string) {
    // if (name === 'done') {
    this._backward('name')
    this._backward('done')
    // }
  }
}
