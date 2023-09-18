import { $ } from '../../../../Class/$'
import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { SharedRef } from '../../../../SharefRef'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { J } from '../../../../types/interface/J'
import { U } from '../../../../types/interface/U'
import { $wrap } from '../../../../wrap'
import { wrapObject } from '../../../../wrap/Object'
import { ID_SCOPE } from '../../../_ids'

export interface I<T> {
  unit: U & $
}

export interface O<T> {
  obj: J
}

export default class Scope<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit'],
        o: ['obj'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
        output: {
          obj: {
            ref: true,
          },
        },
      },
      system,
      ID_SCOPE
    )
  }

  async f({ unit }: I<T>, done: Done<O<T>>): Promise<void> {
    const {
      global: { scope },
    } = this.__system

    const { __global_id } = unit

    scope[__global_id] = scope[__global_id] ?? {}

    const localScope = scope[__global_id]

    const sharedRef: SharedRef<Dict<any>> = { current: localScope }

    const _obj = wrapObject(sharedRef, this.__system)

    const obj = $wrap<any>(this.__system, _obj, ['J'])

    done({ obj })
  }
}
