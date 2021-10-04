import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'
import { A } from '../../../../../interface/A'

export interface I<T> {
  'a[]': A
  a: T
}

export interface O<T> {}

export default class Append<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a[]', 'a'],
        o: [],
      },
      config,
      {
        input: {
          arr: {
            ref: true,
          },
        },
      }
    )
  }

  async f({ 'a[]': _a, a }: I<T>, done: Done<O<T>>): Promise<void> {
    await _a.append(a)
    done({})
  }
}
