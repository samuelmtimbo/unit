import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { extractInterface } from '../../../../../extractInterface'
import { System } from '../../../../../system'
import { $_ } from '../../../../../types/interface/$_'
import { Async } from '../../../../../types/interface/async/Async'
import { J } from '../../../../../types/interface/J'
import { ID_DEEP_GET_1 } from '../../../../_ids'

export interface I<T> {
  obj: J
  path: string[]
}

export interface O<T> {
  value: $_
}

export default class DeepGet0<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'path'],
        o: ['value'],
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
      ID_DEEP_GET_1
    )
  }

  async f({ obj, path }: I<T>, done: Done<O<T>>) {
    let value_: any

    try {
      value_ = await obj.deepGet(path)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const _ = extractInterface(value_)

    const value = Async(value_, _)

    done({
      value,
    })
  }
}
