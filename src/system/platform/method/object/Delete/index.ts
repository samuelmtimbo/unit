import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { J } from '../../../../../types/interface/J'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  unit: J
  name: string
}

export interface O<T> {
  data: any
}

export default class Delete<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
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
      pod
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
