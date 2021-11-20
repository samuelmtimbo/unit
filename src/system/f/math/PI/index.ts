import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  any: any
}

export interface O<T> {
  pi: number
}

export default class PI<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['any'],
      o: ['PI'],
    })
  }

  f({ any }: I<T>, done): void {
    done({ PI: Math.PI })
  }
}
