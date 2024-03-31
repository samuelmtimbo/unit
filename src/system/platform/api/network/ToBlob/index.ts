import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { B } from '../../../../../types/interface/B'
import { RES } from '../../../../../types/interface/RES'
import { wrapBlob } from '../../../../../wrap/Blob'
import { ID_TO_BLOB_0 } from '../../../../_ids'

export type I = {
  res: RES & $
  any: any
  done: any
}

export type O = {
  blob: B & $
}

export default class ToBlob extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['res', 'any'],
        fo: ['blob'],
        i: ['done'],
        o: [],
      },
      {},
      system,
      ID_TO_BLOB_0
    )
  }

  async f({ res }: I, done: Done<O>) {
    const _blob = await res.toBlob()

    const blob = wrapBlob(_blob, this.__system)

    done({ blob })
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {

    this._forward_empty('blob')

    this._backward('any')
    this._backward('done')
    // }
  }
}
