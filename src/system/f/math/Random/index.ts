import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  a: number
}

export interface O<T> {
  random: number
}

export default class Random<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['any'],
      o: ['random'],
    })
  }

  f({ a }: I<T>, done): void {
    done({ random: Math.random() })
  }
}
