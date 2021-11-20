import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { J } from '../../../../../interface/J'

export interface I<T> {
  unit: J
  name: string
}

export interface O<T> {
  data: any
}

export default class Delete<T> extends Functional<I<T>, O<T>> {
  constructor() {
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
      }
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
