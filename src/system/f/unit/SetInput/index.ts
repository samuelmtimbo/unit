import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { UnitClass } from '../../../../types/UnitClass'

export interface I<T> {
  unit: UnitClass
  name: string
  data: any
}

export interface O<T> {
  unit: UnitClass
}

export default class SetInput<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['unit', 'name', 'data'],
      o: ['unit'],
    })
  }

  f({ unit, name, data }: I<T>, done: Done<O<T>>): void {
    const id = unit.__id

    // TODO
    done({ unit })
  }
}
