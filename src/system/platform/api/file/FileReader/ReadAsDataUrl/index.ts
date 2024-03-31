import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { B } from '../../../../../../types/interface/B'
import { FR } from '../../../../../../types/interface/FR'
import { ID_TO_DATA_URL } from '../../../../../_ids'

export type I = {
  opt: {}
  reader: FR
  blob: B
}

export type O = {
  url: string
}

export default class ReadAsDataUrl extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['reader', 'blob', 'opt'],
        o: ['url'],
      },
      {
        input: {
          blob: {
            ref: true,
          },
          reader: {
            ref: true,
          },
        },
      },
      system,
      ID_TO_DATA_URL
    )
  }

  async f({ reader, blob, opt }: I, done: Done<O>): Promise<void> {
    const blob_ = await blob.blob()

    const url = await reader.readAsDataUrl(blob_)

    done({ url })
  }
}
