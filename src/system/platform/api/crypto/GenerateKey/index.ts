import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { CK } from '../../../../../types/interface/CK'
import { J } from '../../../../../types/interface/J'
import { wrapCryptoKey } from '../../../../../wrap/CryptoKey'
import { ID_GENERATE_KEY } from '../../../../_ids'

export type I = {
  algorithm: J & $
  extractable: boolean
  keyUsages: string[]
}

export type O = {
  key: CK
}

export default class GenerateKey extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['algorithm', 'extractable', 'keyUsages'],
        fo: ['key'],
      },
      {
        input: {
          algorithm: {
            ref: true,
          },
        },
        output: {
          key: {
            ref: true,
          },
        },
      },
      system,
      ID_GENERATE_KEY
    )
  }

  async f(
    { algorithm, extractable, keyUsages }: I,
    done: Done<O>,
    fail: Fail
  ): Promise<void> {
    const {
      api: {
        crypto: { generateKey },
      },
    } = this.__system

    const algorithm_ = algorithm.raw()

    if (!['HMAC'].includes(algorithm_.name)) {
      fail('invalid algorithm single key generation')

      return
    }

    let key_: CryptoKey

    try {
      key_ = (await generateKey(
        algorithm_,
        extractable,
        keyUsages
      )) as CryptoKey
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    const key = wrapCryptoKey(key_, this.__system)

    done({ key })
  }
}
