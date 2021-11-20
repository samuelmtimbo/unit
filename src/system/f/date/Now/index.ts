import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  any: T
}

export interface O<T> {
  now: number
}

export default class Now<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['any'],
        o: ['now'],
      },
      config
    )
  }

  f({ any }: Partial<I<T>>, done): void {
    done({ now: new Date().getTime() })
  }
}
