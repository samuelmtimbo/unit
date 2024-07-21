import { $ } from '../../../../../../Class/$'
import { Done } from '../../../../../../Class/Functional/Done'
import { Holder } from '../../../../../../Class/Holder'
import { System } from '../../../../../../system'
import { A } from '../../../../../../types/interface/A'
import { AAN } from '../../../../../../types/interface/AAN'
import { wrapUint8Array } from '../../../../../../wrap/Array'
import { ID_GET_BYTE_TIME_DOMAIN_DATA } from '../../../../../_ids'

export type I = {
  node: AAN & $
  opt: {}
}

export type O = {
  data: A & $
}

export default class GetByteTimeDomainData extends Holder<I, O> {
  private _data: Uint8Array

  constructor(system: System) {
    super(
      {
        fi: ['node', 'opt'],
        fo: ['data'],
      },
      {
        input: {
          node: {
            ref: true,
          },
        },
        output: {
          data: {
            ref: true,
          },
        },
      },
      system,
      ID_GET_BYTE_TIME_DOMAIN_DATA
    )
  }

  f({ node, opt }: I, done: Done<O>) {
    const fftSize = node.getFFTSize()

    this._data = new Uint8Array(fftSize)

    node.getByteTimeDomainData(this._data)

    const data = wrapUint8Array(this._data, this.__system)

    done({
      data,
    })
  }

  d() {
    //
  }

  private _reset = () => {
    this._data = undefined

    this._backward_all()
  }
}
