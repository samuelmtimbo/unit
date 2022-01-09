import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { J } from '../../../../../interface/J'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  unit: J
  name: string
}

export interface O<T> {
  value: T
}

export default class Get<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
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
      pod
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
