import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  'a[]': T[]
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
      config
    )
  }

  f({ 'a[]': _a, a }: I<T>, done: Done<O<T>>): void {
    done({
      i: _a.indexOf(a),
    })
  }
}
