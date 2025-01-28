import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { FD } from '../../../../../types/interface/FD'
import { ID_APPEND_1 } from '../../../../_ids'

export interface I<T> {
  form: FD
  value: any
  name: string
}

export interface O<T> {
  done: any
}

export default class Append<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['form', 'name', 'value'],
        fo: [],
        i: [],
        o: ['done'],
      },
      {
        input: {
          form: {
            ref: true,
          },
          value: {
            ref: true,
          },
        },
      },
      system,
      ID_APPEND_1
    )
  }

  async f({ form, name, value }: I<T>, done: Done<O<T>>): Promise<void> {
    try {
      const data = await value.raw()

      form.append(name, data)
    } catch (err) {
      done(undefined, err.message.toString())

      return
    }

    done({
      done: true,
    })
  }

  b() {
    this._output.done.push(true)
  }
}
