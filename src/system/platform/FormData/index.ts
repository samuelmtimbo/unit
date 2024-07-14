import { $ } from '../../../Class/$'
import { Done } from '../../../Class/Functional/Done'
import { Semifunctional } from '../../../Class/Semifunctional'
import { System } from '../../../system'
import { FD } from '../../../types/interface/FD'
import { J } from '../../../types/interface/J'
import { wrapFormData } from '../../../wrap/FormData'
import { ID_FORM_DATA } from '../../_ids'

export interface I {
  data: object
  done: any
}

export interface O {
  form: J & FD & $
}

export default class FormData_ extends Semifunctional<I, O> {
  __ = ['U']

  constructor(system: System) {
    super(
      {
        fi: ['data'],
        fo: ['form'],
        i: ['done'],
        o: [],
      },
      {
        output: {
          form: {
            ref: true,
          },
        },
      },
      system,
      ID_FORM_DATA
    )
  }

  f(i: Partial<I>, done: Done<O>): void {
    const { data } = i

    const form_ = new FormData()

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key]

        form_.append(key, value)
      }
    }

    const form = wrapFormData(form_, this.__system)

    done({
      form,
    })
  }

  onIterDataInputData<K extends keyof I>(name: K, data: any): void {
    super.onIterDataInputData(name, data)

    // if (name === 'done') {
    this._forward_all_empty()

    this._backward_all()

    this._backward('done')
    // }
  }
}
