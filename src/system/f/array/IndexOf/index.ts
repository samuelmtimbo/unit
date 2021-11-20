import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'

export interface I<T> {
  'a[]': T[]
  a: T
}

export interface O<T> {
  i: number
}

export default class IndexOf<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a[]', 'a'],
      o: ['i'],
    })
  }

  f({ 'a[]': _a, a }: I<T>, done: Done<O<T>>): void {
    done({
      i: _a.indexOf(a),
    })
  }
}
