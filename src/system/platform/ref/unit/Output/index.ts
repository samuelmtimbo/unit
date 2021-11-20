import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Config } from '../../../../../Class/Unit/Config'
import { U } from '../../../../../interface/U'
import { V } from '../../../../../interface/V'

export interface I<T> {
  unit: U
  name: string
  done: T
}

export interface O<T> {
  pin: V
}

export default class Output<T> extends Semifunctional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        fi: ['unit', 'name'],
        fo: ['pin'],
        i: ['done'],
      },
      config,
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
      }
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
