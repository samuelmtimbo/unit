import { Functional } from '../../../../Class/Functional'
import { Dict } from '../../../../types/Dict'
import keys from './f'

export interface I<T> {
  obj: Dict<T>
}

export interface O<T> {
  keys: string[]
}

export default class Keys<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['obj'],
      o: ['keys'],
    })
  }

  f(i: I<T>, done): void {
    done(keys(i))
  }
}
