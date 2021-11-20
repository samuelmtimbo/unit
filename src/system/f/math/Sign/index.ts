import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  a: number
}

export interface O<T> {
  'sign(a)': number
}

export default class Sign<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['a'],
      o: ['sign(a)'],
    })
  }

  f({ a }: I<T>, done): void {
    done({ 'sign(a)': Math.sign(a) })
  }
}
