import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { U } from '../../../../../types/interface/U'
import { V } from '../../../../../types/interface/V'
import { ID_INPUT } from '../../../../_ids'

export interface I<T> {
  unit: U
  name: string
  done: T
}

export interface O<T> {
  pin: V
}

export default class Input<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['unit', 'name'],
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
      ID_INPUT
    )
  }

  async f({ unit, name }: I<T>, done: Done<O<T>>) {
    try {
      const pin = unit.getInput(name)

      const value = new (class Value extends $ implements V<T> {
        async read(): Promise<T> {
          return pin.read()
        }

        async write(data: any): Promise<void> {
          pin.write(data)
        }
      })(this.__system)

      done({ pin: value })
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
