import { Unit } from '../../../../Class/Unit'
import { System } from '../../../../system'
import { wrapObject } from '../../../../wrap/Object'
import { ID_ENV } from '../../../_ids'

export type I = {}

export type O = {
  obj: object
}

export default class Env extends Unit<I, O> {
  constructor(system: System) {
    super(
      {
        i: [],
        o: ['obj'],
      },
      {
        output: {
          obj: {
            ref: true,
          },
        },
      },
      system,
      ID_ENV
    )

    const {
      global: { env },
    } = system

    const obj = wrapObject(env, this.__system)

    this._output.obj.push(obj)
  }
}
