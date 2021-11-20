import { Functional } from '../../../../Class/Functional'
import { Dict } from '../../../../types/Dict'
import set from './f'

export interface I<T> {
  obj: Dict<T>
  key: string | number
  value: T
}

export interface O<T> {
  obj: object
}

export default class Set<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['obj', 'key', 'value'],
      o: ['obj'],
    })
  }

  f({ obj, key, value }: I<T>, done): void {
    done({ obj: set(obj, key, value) })
  }
}
