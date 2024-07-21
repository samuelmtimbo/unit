import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { Unit } from '../../../../../Class/Unit'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_LOOKUP } from '../../../../_ids'

export interface I {
  unit: Unit
  name: string
  done: any
}

export interface O {
  ref: any
}

export default class Lookup extends Holder<I, O> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['unit', 'name'],
        fo: ['ref'],
        o: [],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
        output: {
          ref: {
            ref: true,
          },
        },
      },
      system,
      ID_LOOKUP
    )
  }

  f({ unit, name }: I, done: Done<O>): void {
    const ref = this.__system.global.scope[name]

    this._unlisten = this.__system.emitter.addListener(
      'register',
      (_name: string, ref: Component_) => {
        if (_name === name) {
          done({ ref })
        }
      }
    )

    if (ref) {
      done({ ref })
    }
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }
}
