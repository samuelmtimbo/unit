import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { B } from '../../../../../types/interface/B'
import { F } from '../../../../../types/interface/F'
import { FR } from '../../../../../types/interface/FR'
import { ID_READ_AS_DATA_URL } from '../../../../_ids'

export type I = {
  opt: {}
  reader: FR
  file: (F | B) & $
}

export type O = {
  url: string
}

export default class ReadAsDataUrl extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['reader', 'file', 'opt'],
        o: ['url'],
      },
      {
        input: {
          file: {
            ref: true,
          },
          reader: {
            ref: true,
          },
        },
      },
      system,
      ID_READ_AS_DATA_URL
    )
  }

  async f({ reader, file, opt }: I, done: Done<O>): Promise<void> {
    const file_ = (await file.raw()) as File | Blob

    const url = await reader.readAsDataUrl(file_)

    done({ url })
  }
}
