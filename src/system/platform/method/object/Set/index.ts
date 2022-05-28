import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { J } from '../../../../../types/interface/J'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  unit: J
  name: string
  data: T
}

export interface O<T> {
  data: any
}

export default class Set<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
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
      pod
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
