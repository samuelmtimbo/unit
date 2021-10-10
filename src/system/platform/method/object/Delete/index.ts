import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'
import { J } from '../../../../../interface/J'

export interface I<T> {
  unit: J
  name: string
}

export interface O<T> {
  data: any
}

export default class Delete<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['unit', 'name'],
        o: ['data'],
      },
      config,
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
