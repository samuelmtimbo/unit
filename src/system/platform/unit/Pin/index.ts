import { $ } from '../../../../Class/$'
import { Done } from '../../../../Class/Functional/Done'
import { Holder } from '../../../../Class/Holder'
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
  done: any
}

export default class Pin_<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['unit', 'name', 'type'],
        fo: ['pin'],
        i: [],
        o: ['done'],
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

  b() {
    this._output.done.push(true)
  }
}
