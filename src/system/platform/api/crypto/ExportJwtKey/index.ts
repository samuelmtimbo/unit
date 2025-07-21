import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { CK } from '../../../../../types/interface/CK'
import { ID_EXPORT_JWK_KEY } from '../../../../_ids'

export type I = {
  key: CK & $
  format: 'jwk'
}

export type O = {
  key: JsonWebKey
}

export default class ExportJwtKey extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['key', 'format'],
        o: ['key'],
      },
      {
        input: {
          key: {
            ref: true,
          },
        },
      },
      system,
      ID_EXPORT_JWK_KEY
    )
  }

  async f({ key, format }: I, done: Done<O>, fail: Fail): Promise<void> {
    const {
      api: {
        crypto: { exportKey },
      },
    } = this.__system

    const key__ = (await key.raw()) as CryptoKey

    let key_: JsonWebKey

    try {
      key_ = (await exportKey(format, key__)) as JsonWebKey
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    done({ key: key_ })
  }
}
