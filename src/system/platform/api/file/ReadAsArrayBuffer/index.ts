import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { AB } from '../../../../../types/interface/AB'
import { B } from '../../../../../types/interface/B'
import { F } from '../../../../../types/interface/F'
import { FR } from '../../../../../types/interface/FR'
import { wrapArrayBuffer } from '../../../../../wrap/ArrayBuffer'
import { ID_READ_AS_ARRAY_BUFFER } from '../../../../_ids'

export type I = {
  opt: {}
  reader: FR
  file: (F | B) & $
}

export type O = {
  array: AB
}

export default class ReadAsArrayBuffer extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['reader', 'file', 'opt'],
        o: ['array'],
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
        output: {
          array: {
            ref: true,
          },
        },
      },
      system,
      ID_READ_AS_ARRAY_BUFFER
    )
  }

  async f({ reader, file, opt }: I, done: Done<O>, fail: Fail): Promise<void> {
    const file_ = (await file.raw()) as File | Blob

    let array_: ArrayBuffer

    try {
      array_ = await reader.readAsArrayBuffer(file_)
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    const array = wrapArrayBuffer(array_, this.__system)

    done({ array })
  }
}
