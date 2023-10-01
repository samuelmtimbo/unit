import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_GET_0 } from '../../../../_ids'

export interface I<T> {
  obj: J
  name: string
}

export interface O<T> {
  value: T
}

export default class Get<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'name'],
        o: ['value'],
      },
      {
        input: {
          obj: {
            ref: true,
          },
        },
      },
      system,
      ID_GET_0
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
}
