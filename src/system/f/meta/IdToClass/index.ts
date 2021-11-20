import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { fromId } from '../../../../spec/fromId'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  id: string
}

export interface O<T> {
  Class: UnitClass<any>
}

export default class IdToClass<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['id'],
      o: ['Class'],
    })
  }

  f({ id }: I<T>, done: Done<O<T>>): void {
    if (!this.__system) {
      done(undefined, 'unplugged')
      return
    }

    const { specs, classes } = this.__system

    const Class = fromId(id, specs, classes)
    done({ Class })
  }
}
