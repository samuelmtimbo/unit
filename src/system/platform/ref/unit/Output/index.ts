import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { U } from '../../../../../types/interface/U'
import { V } from '../../../../../types/interface/V'
import { ID_OUTPUT } from '../../../../_ids'

export interface I<T> {
  unit: U
  name: string
  done: T
}

export interface O<T> {
  pin: V
}

export default class Output<T> extends Semifunctional<I<T>, O<T>> {
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
      ID_OUTPUT
    )
  }

  async f({ unit, name }: I<T>, done: Done<O<T>>) {
    try {
      const pin = unit.getOutput(name)
      done({ pin })
    } catch (err) {
      done(undefined, err)
    }
  }

  onIterDataInputData(name: string) {
    // if (name === 'done') {
    this._backward('name')
    this._backward('done')
    // }
  }
}
