import { Functional } from '../../../../Class/Functional'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  str: string
  regex: string
}

export interface O<T> {
  match: boolean
}

export default class Test<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['str', 'regex'],
        o: ['match'],
      },
      config
    )
  }

  f({ str, regex }: Partial<I<T>>, done): void {
    done({ match: !!str.match(regex) })
  }
}
