import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  name: string
}

export interface O<T> {
  id: string
}

export default class NameToId<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['name'],
        o: ['id'],
      },
      config
    )
  }

  f({ name }: I<T>, done: Done<O<T>>): void {
    const id = globalThis.__name__to__id[name]
    if (!id) {
      done(undefined, 'could not find unit with given name')
    } else {
      done({ id })
    }
  }
}
