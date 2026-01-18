import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { evaluate } from '../../../../../spec/evaluate'
import { System } from '../../../../../system'
import { $V } from '../../../../../types/interface/async/$V'
import { Async } from '../../../../../types/interface/async/Async'
import { ID_READ } from '../../../../_ids'

export interface I<T> {
  value: $V
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

  f({ value, any }: I<T>, done: Done<O<T>>, fail: Fail) {
    const { classes, specs } = this.__system

    value = Async(value, ['V'], this.__system.async)

    value.$read({}, (data_, err) => {
      const data = evaluate(data_, specs, classes)

      if (err) {
        fail(err)

        return
      }

      done({ data })
    })
  }

  b() {
    this._output.done.push(true)
  }
}
