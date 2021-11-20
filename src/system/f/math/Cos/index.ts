import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  a: number
}

export interface O<T> {
  'cos(a)': number
}

export default class Cos<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a'],
      o: ['cos(a)'],
    })
  }

  f({ a }: I<T>, done): void {
    done({ 'cos(a)': Math.cos(a) })
  }
}
