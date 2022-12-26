import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_DELETE } from '../../../../_ids'

export interface I<T> {
  unit: J
  name: string
}

export interface O<T> {
  data: any
}

export default class Delete<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'name'],
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
      ID_DELETE
    )
  }

  async f({ unit, name }: I<T>, done: Done<O<T>>) {
    try {
      const data = await unit.delete(name)
      done({ data })
    } catch (err) {
      done(undefined, err)
    }
  }
}
