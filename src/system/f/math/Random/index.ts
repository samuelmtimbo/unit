import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: number
}

export interface O<T> {
  random: number
}

export default class Random<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['any'],
        o: ['random'],
      },
      config
    )
  }

  f({ a }: I<T>, done): void {
    done({ random: Math.random() })
  }
}
