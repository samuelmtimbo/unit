import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { Spec } from '../../../../types'

export interface I<T> {
  id: string
}

export interface O<T> {
  spec: Spec
}

export default class IdToSpec<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['id'],
        o: ['spec'],
      },
      config
    )
  }

  f({ id }: I<T>, done: Done<O<T>>): void {
    if (!!globalThis.__specs) {
      if (!!globalThis.__specs[id]) {
        done({ spec: globalThis.__specs[id] })
      } else {
        done(undefined, 'cannot find spec with this id')
      }
    } else {
      done(undefined, 'cannot find system specs')
    }
  }
}
