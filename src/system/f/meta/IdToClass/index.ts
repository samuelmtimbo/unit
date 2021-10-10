import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { fromId } from '../../../../spec/fromId'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  id: string
}

export interface O<T> {
  Class: UnitClass<any>
}

export default class IdToClass<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['id'],
        o: ['Class'],
      },
      config
    )
  }

  f({ id }: I<T>, done: Done<O<T>>): void {
    const Class = fromId(id, globalThis.__specs)
    done({ Class })
  }
}
