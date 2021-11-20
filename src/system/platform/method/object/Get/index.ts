import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { J } from '../../../../../interface/J'

export interface I<T> {
  unit: J
  name: string
}

export interface O<T> {
  value: T
}

export default class Get<T> extends Functional<I<T>, O<T>> {
  constructor() {
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
      }
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
