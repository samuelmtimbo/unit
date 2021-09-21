import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { Specs } from '../../../../types'

export interface I<T> {
  any: any
}

export interface O<T> {
  specs: Specs
}

export default class _Specs<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['any'],
        o: ['specs'],
      },
      config
    )
  }

  f({ any }: I<T>, done: Done<O<T>>): void {
    if (!!globalThis.__specs) {
      done({ specs: globalThis.__specs })
    } else {
      done(undefined, 'cannot find system specs')
    }
  }
}
