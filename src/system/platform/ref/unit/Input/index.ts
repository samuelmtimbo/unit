import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { U } from '../../../../../types/interface/U'
import { V } from '../../../../../types/interface/V'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  unit: U
  name: string
  done: T
}

export interface O<T> {
  pin: V
}

export default class Input<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
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
      pod
    )
  }

  async f({ unit, name }: I<T>, done: Done<O<T>>) {
    try {
      const pin = unit.getInput(name)
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
