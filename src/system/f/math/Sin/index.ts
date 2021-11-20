import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  a: number
}

export interface O<T> {
  'sin(a)': number
}

export default class Sin<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a'],
      o: ['sin(a)'],
    })
  }

  f({ a }: I<T>, done): void {
    done({ 'sin(a)': Math.sin(a) })
  }
}
