import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'
import { uuid } from '../../../../util/id'

export interface I<T> {
  any: T
}

export interface O<T> {
  uuid: T
}

export default class UUID<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['any'],
        o: ['uuid'],
      },
      config
    )
  }

  f({ any }: Partial<I<T>>, done): void {
    done({ uuid: uuid() })
  }
}
