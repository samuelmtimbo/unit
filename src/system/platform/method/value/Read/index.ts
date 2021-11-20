import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'
import { V } from '../../../../../interface/V'

export interface I<T> {
  value: V
  any: string
}

export interface O<T> {
  data: T
}

export default class Read<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['value', 'any'],
        o: ['data'],
      },
      config,
      {
        input: {
          value: {
            ref: true,
          },
        },
      }
    )
  }

  async f({ value, any }: I<T>, done: Done<O<T>>) {
    try {
      const data = await value.read()
      done({ data })
    } catch (err) {
      done(undefined, err)
    }
  }
}
