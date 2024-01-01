import { $ } from '@_unit/unit/lib/Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_SET_1 } from '../../../../_ids'

export interface I<T> {
  obj: J
  name: string
  data: $
  done: any
}

export interface O<T> {
  done: any
}

export default class Set0<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['obj', 'name', 'data'],
        fo: ['done'],
        i: ['done'],
        o: [],
      },
      {
        input: {
          obj: {
            ref: true,
          },
          data: {
            ref: true,
          },
        },
      },
      system,
      ID_SET_1
    )
  }

  async f({ obj, name, data }: I<T>, done: Done<O<T>>) {
    try {
      const raw = await data.raw()

      await obj.set(name, raw)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ done: 1 })
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._forward_all_empty()

    this._backward_all()

    this._backward('done')
    // }
  }
}
