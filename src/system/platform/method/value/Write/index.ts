import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { V } from '../../../../../types/interface/V'
import { ID_WRITE } from '../../../../_ids'

export interface I<T> {
  value: V<T>
  data: T
}

export interface O<T> {
  done: any
}

export default class Write<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['value', 'data'],
        fo: [],
        i: [],
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
      ID_WRITE
    )
  }

  async f({ value, data }: I<T>, done: Done<O<T>>, fail: Fail) {
    value.write(data, (data, err) => {
      if (err) {
        fail(err)

        return
      }

      done()
    })
  }

  b() {
    this._output.done.push(true)
  }
}
