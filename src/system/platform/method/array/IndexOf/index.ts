import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'
import { A } from '../../../../../interface/A'

export interface I<T> {
  'a[]': A
  a: T
}

export interface O<T> {
  i: number
}

export default class IndexOf<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a[]', 'a'],
        o: ['i'],
      },
      config,
      {
        input: {
          'a[]': {
            ref: true,
          },
        },
      }
    )
  }

  async f({ 'a[]': _a, a }: I<T>, done: Done<O<T>>): Promise<void> {
    const i = await _a.indexOf(a)
    done({
      i,
    })
  }
}
