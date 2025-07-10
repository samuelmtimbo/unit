import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'
import { ID_CLEAR } from '../../../../_ids'

export interface I<T> {
  any: any
  canvas: $ & CA
}

export interface O<T> {}

export default class Clear<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['any', 'canvas'],
        o: [],
      },
      {
        input: {
          canvas: {
            ref: true,
          },
        },
      },
      system,
      ID_CLEAR
    )
  }

  async f({ any, canvas }: I<T>, done: Done<O<T>>): Promise<void> {
    await canvas.clear()

    done()
  }
}
