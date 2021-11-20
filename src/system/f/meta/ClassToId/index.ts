import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  Class: UnitClass<any>
}

export interface O<T> {
  id: string
}

export default class ClassToId<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['Class'],
      o: ['id'],
    })
  }

  f({ Class }: I<T>, done: Done<O<T>>): void {
    const id = Class.__id
    done({ id })
  }
}
