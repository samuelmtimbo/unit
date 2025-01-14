import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { V } from '../../../../../types/interface/V'
import { ID_READ } from '../../../../_ids'

export interface I<T> {
  value: V<T>
  any: any
}

export interface O<T> {
  data: T
  done: any
}

export default class Read<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['value', 'any'],
        fo: ['data'],
        o: ['done'],
      },
      {
        input: {
          value: {
            ref: true,
          },
        },
      },
      system,
      ID_READ
    )
  }

  f({ value, any }: I<T>, done: Done<O<T>>) {
    value.read((data, err) => {
      if (err) {
        done(undefined, err)

        return
      }

      done({ data })
    })
  }

  d() {
    this._output.done.push(true)
  }
}
