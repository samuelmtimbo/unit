import { Done } from '../../../Class/Functional/Done'
import { Semifunctional } from '../../../Class/Semifunctional'
import { System } from '../../../system'
import { Dict } from '../../../types/Dict'
import { V } from '../../../types/interface/V'
import { wrapValue } from '../../../wrap/Value'
import { ID_STATE } from '../../_ids'

export interface I<T> {
  init: T
  done: any
}

export interface O<T> {
  data: V<T>
}

export default class State<T extends Dict<any>> extends Semifunctional<
  I<T>,
  O<T>
> {
  constructor(system: System) {
    super(
      {
        fi: ['init'],
        fo: ['data'],
        i: ['done'],
        o: [],
      },
      {
        output: {
          data: {
            ref: true,
          },
        },
      },
      system,
      ID_STATE
    )
  }

  f({ init }: I<T>, done: Done<O<T>>): void {
    const data = wrapValue(init, this.__system)

    done({
      data,
    })
  }

  onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._backward('init')
    this._backward('done')
    // }
  }
}
