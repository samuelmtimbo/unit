import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  Class: UnitClass<any>
}

export interface O<T> {
  id: string
}

export default class ClassToId<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['Class'],
        o: ['id'],
      },
      config
    )
  }

  f({ Class }: I<T>, done: Done<O<T>>): void {
    const id = Class.id
    done({ id })
  }
}
