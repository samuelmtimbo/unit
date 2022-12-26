import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_GET_0 } from '../../../../_ids'

export interface I<T> {
  unit: J
  name: string
}

export interface O<T> {
  value: T
}

export default class Get<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'name'],
        o: ['value'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_GET_0
    )
  }

  async f({ unit, name }: I<T>, done: Done<O<T>>) {
    try {
      const value = await unit.get(name)

      done({ value })
    } catch (err) {
      done(undefined, err)
    }
  }
}
