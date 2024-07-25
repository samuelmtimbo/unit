import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { AB } from '../../../../../types/interface/AB'
import { CK } from '../../../../../types/interface/CK'
import { J } from '../../../../../types/interface/J'
import { wrapCryptoKey } from '../../../../../wrap/CryptoKey'
import { ID_IMPORT_KEY } from '../../../../_ids'

export type I = {
  data: AB & $
  format: Exclude<KeyFormat, 'jwk'>
  algorithm: J & $
  extractable: boolean
  keyUsages: KeyUsage[]
  done: any
}

export type O = {
  key: CK
}

export default class ImportKey extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['format', 'algorithm', 'extractable', 'keyUsages'],
        fo: ['key'],
        i: [],
        o: [],
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
      ID_IMPORT_KEY
    )
  }

  async f(
    { format, data, algorithm, extractable, keyUsages }: I,
    done: Done<O>
  ): Promise<void> {
    const {
      api: {
        crypto: { importKey },
      },
    } = this.__system

    let data_ = data.raw() as ArrayBuffer
    let algorithm_ = algorithm.raw() as AlgorithmIdentifier

    const key_ = await importKey(
      format,
      data_,
      algorithm_,
      extractable,
      keyUsages
    )

    const key = wrapCryptoKey(key_, this.__system)

    done({ key })
  }
}
