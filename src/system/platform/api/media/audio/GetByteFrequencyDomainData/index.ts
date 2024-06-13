import { $ } from '../../../../../../Class/$'
import { Done } from '../../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../../Class/Semifunctional'
import { System } from '../../../../../../system'
import { A } from '../../../../../../types/interface/A'
import { AAN } from '../../../../../../types/interface/AAN'
import { wrapUint8Array } from '../../../../../../wrap/Array'
import { ID_GET_BYTE_FREQUENCY_DATA } from '../../../../../_ids'

export type I = {
  node: AAN & $
  opt: {}
  done: any
}

export type O = {
  data: A & $
}

export default class GetByteFrequencyData extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['node', 'opt'],
        fo: ['data'],
        i: ['done'],
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
      ID_GET_BYTE_FREQUENCY_DATA
    )
  }

  f({ node, opt }: I, done: Done<O>) {
    const fftSize = node.getFFTSize()

    const _data = new Uint8Array(fftSize)

    node.getByteFrequencyData(_data)

    const data = wrapUint8Array(_data, this.__system)

    done({
      data,
    })
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._forward_empty('data')

    this._backward('node')

    this._backward('done')
    // }
  }
}
