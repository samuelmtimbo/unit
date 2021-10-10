import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: number
}

export interface O<T> {
  'sin(a)': number
}

export default class Sin<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['sin(a)'],
      },
      config
    )
  }

  f({ a }: I<T>, done): void {
    done({ 'sin(a)': Math.sin(a) })
  }
}
