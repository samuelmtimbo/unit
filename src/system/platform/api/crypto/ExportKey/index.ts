import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { AB } from '../../../../../types/interface/AB'
import { CK } from '../../../../../types/interface/CK'
import { wrapArrayBuffer } from '../../../../../wrap/ArrayBuffer'
import { ID_EXPORT_KEY } from '../../../../_ids'

export type I = {
  key: CK & $
  format: Exclude<KeyFormat, 'jwk'>
}

export type O = {
  key: AB
}

export default class ExportKey extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['key', 'format'],
        fo: ['key'],
      },
      {
        input: {
          key: {
            ref: true,
          },
        },
        output: {},
      },
      system,
      ID_EXPORT_KEY
    )
  }

  async f({ key, format }: I, done: Done<O>, fail: Fail): Promise<void> {
    const {
      api: {
        crypto: { exportKey },
      },
    } = this.__system

    const key___ = (await key.raw()) as CryptoKey

    let key__: ArrayBuffer

    try {
      key__ = (await exportKey(format, key___)) as ArrayBuffer
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    const key_ = wrapArrayBuffer(key__, this.__system)

    done({ key: key_ })
  }
}
