import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Unit } from '../../../../../Class/Unit'
import { System } from '../../../../../system'
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

export default class Lookup extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['unit', 'name'],
        i: ['done'],
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
    // TODO

    const ref = this.__system.global.scope[name]

    this.__system.emitter.addListener(
      'register',
      (name: string, ref: Component_) => {}
    )

    if (ref) {
      done({ ref })
    }
  }

  public onIterDataInputData(name: string, data: any): void {
    switch (name) {
      case 'done':
        this._done()

        this._backward('done')

        break
    }
  }
}
