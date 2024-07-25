import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { CK } from '../../../../../types/interface/CK'
import { J } from '../../../../../types/interface/J'
import { wrapCryptoKey } from '../../../../../wrap/CryptoKey'
import { ID_IMPORT_JWT_KEY } from '../../../../_ids'

export type I = {
  data: JsonWebKey
  algorithm: J & $
  extractable: boolean
  keyUsages: KeyUsage[]
}

export type O = {
  key: CK
}

export default class ImportJwkKey extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['algorithm', 'extractable', 'keyUsages', 'data'],
        o: ['key'],
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
      ID_IMPORT_JWT_KEY
    )
  }

  async f(
    { data, algorithm, extractable, keyUsages }: I,
    done: Done<O>
  ): Promise<void> {
    const {
      api: {
        crypto: { importKey },
      },
    } = this.__system

    let algorithm_ = algorithm.raw() as AlgorithmIdentifier

    const key_ = await importKey(
      'jwk',
      data,
      algorithm_,
      extractable,
      keyUsages
    )

    const key = wrapCryptoKey(key_, this.__system)

    done({ key })
  }
}
