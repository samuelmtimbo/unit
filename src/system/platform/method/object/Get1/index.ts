import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_GET_1 } from '../../../../_ids'

export interface I<T> {
  obj: J
  name: string
  done: any
}

export interface O<T> {
  value: T
  done: any
}

export default class Get1<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['obj', 'name'],
        fo: ['value'],
        i: [],
        o: ['done'],
      },
      {
        input: {
          obj: {
            ref: true,
          },
        },
        output: {
          value: {
            ref: true,
          },
        },
      },
      system,
      ID_GET_1,
      'done'
    )
  }

  async f({ obj, name }: I<T>, done: Done<O<T>>) {
    let value: any

    try {
      value = await obj.get(name)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ value })
  }

  b() {
    this._output.done.push(true)
  }
}
