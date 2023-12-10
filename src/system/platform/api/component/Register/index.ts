import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Unit } from '../../../../../Class/Unit'
import { System } from '../../../../../system'
import { ID_REGISTER } from '../../../../_ids'

export interface I {
  ref: $
  unit: Unit
  name: string
  done: any
}

export interface O {}

export default class Register extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['unit', 'ref', 'name'],
        i: ['done'],
        fo: [],
        o: [],
      },
      {
        input: {
          ref: {
            ref: true,
          },
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_REGISTER
    )
  }

  f({ ref, unit, name }: I, done: Done<O>): void {
    // TODO

    this.__system.global.scope[name] = ref

    this.__system.emitter.emit('register', name, ref)
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
