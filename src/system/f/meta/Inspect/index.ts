import { $ } from '../../../../Class/$'
import { Done } from '../../../../Class/Functional/Done'
import { Holder } from '../../../../Class/Holder'
import { System } from '../../../../system'
import { ID_INSPECT } from '../../../_ids'

export interface I<T> {
  ref: $
  any: any
}

export interface O<T> {
  interface: { types: string[] }
}

export default class Inspect<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['ref', 'any'],
        fo: ['interface'],
      },
      {
        input: {
          ref: {
            ref: true,
          },
        },
      },
      system,
      ID_INSPECT
    )
  }

  f({ ref }: I<T>, done: Done<O<T>>): void {
    const types = ref.getInterface()

    done({ interface: { types } })
  }
}
