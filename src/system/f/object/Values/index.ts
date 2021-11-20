import { Functional } from '../../../../Class/Functional'
import { Dict } from '../../../../types/Dict'

export interface I<T> {
  obj: Dict<T>
}

export interface O<T> {
  values: T[]
}

export default class Values<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['obj'],
      o: ['values'],
    })
  }

  f({ obj }: I<T>, done): void {
    done({ values: Object.values(obj) })
  }
}
