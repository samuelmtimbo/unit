import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_SET } from '../../../../_ids'

export interface I<T> {
  unit: J
  name: string
  data: T
}

export interface O<T> {
  data: any
}

export default class Set<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'name', 'data'],
        o: ['data'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_SET
    )
  }

  async f({ unit, name, data }: I<T>, done: Done<O<T>>) {
    try {
      await unit.set(name, data)
      done({ data })
    } catch (err) {
      done(undefined, err)
    }
  }
}
