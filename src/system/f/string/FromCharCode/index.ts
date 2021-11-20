import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  code: number
}

export interface O<T> {
  char: string
}

export default class FromCharCode<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['code'],
        o: ['char'],
      },
      config
    )
  }

  f({ code }: I<T>, done: Done<O<T>>): void {
    const char = String.fromCharCode(code)
    done({ char })
  }
}
