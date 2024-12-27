import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { V } from '../../../../../types/interface/V'
import { ID_READ } from '../../../../_ids'

export interface I<T> {
  value: V<T>
  any: any
}

export interface O<T> {
  data: T
}

export default class Read<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'any'],
        o: ['data'],
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
}
