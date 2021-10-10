import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  any: any
}

export interface O<T> {
  pi: number
}

export default class PI<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['any'],
        o: ['PI'],
      },
      config
    )
  }

  f({ any }: I<T>, done): void {
    done({ PI: Math.PI })
  }
}
