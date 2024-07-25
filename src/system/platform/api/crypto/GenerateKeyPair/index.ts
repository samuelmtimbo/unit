import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { CK } from '../../../../../types/interface/CK'
import { J } from '../../../../../types/interface/J'
import { wrapCryptoKey } from '../../../../../wrap/CryptoKey'
import { ID_GENERATE_KEY_PAIR } from '../../../../_ids'

export type I = {
  algorithm: J<{ name: string } & Dict<any>> & $
  extractable: boolean
  keyUsages: string[]
}

export type O = {
  public: CK
  private: CK
}

export default class GenerateKeyPair extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['algorithm', 'extractable', 'keyUsages'],
        fo: ['public', 'private'],
      },
      {
        input: {
          algorithm: {
            ref: true,
          },
        },
        output: {
          public: {
            ref: true,
          },
          private: {
            ref: true,
          },
        },
      },
      system,
      ID_GENERATE_KEY_PAIR
    )
  }

  async f(
    { algorithm, extractable, keyUsages }: I,
    done: Done<O>
  ): Promise<void> {
    const {
      api: {
        crypto: { generateKey },
      },
    } = this.__system

    const algorithm_ = algorithm.raw() as { name: string }

    if (
      !['RSASSA-PKCS1-v1_5', 'RSA-PSS', 'RSA-OAEP', 'ECDSA'].includes(
        algorithm_.name
      )
    ) {
      done(undefined, 'invalid algorithm for key pair generation')

      return
    }

    let keyPair: CryptoKeyPair

    try {
      keyPair = (await generateKey(
        algorithm_,
        extractable,
        keyUsages
      )) as CryptoKeyPair
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

    const { publicKey, privateKey } = keyPair

    const public_ = wrapCryptoKey(publicKey, this.__system)
    const private_ = wrapCryptoKey(privateKey, this.__system)

    done({ public: public_, private: private_ })
  }
}
