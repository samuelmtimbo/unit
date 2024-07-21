import { $ } from '../../../../../../Class/$'
import { Done } from '../../../../../../Class/Functional/Done'
import { Holder } from '../../../../../../Class/Holder'
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

export default class GetByteFrequencyData extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['node', 'opt'],
        fo: ['data'],
        i: [],
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
}
