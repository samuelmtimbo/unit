import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { AB } from '../../../../../types/interface/AB'
import { CK } from '../../../../../types/interface/CK'
import { J } from '../../../../../types/interface/J'
import { ID_VERIFY } from '../../../../_ids'

export type I = {
  key: CK & $
  algorithm: J<any> & $
  signature: AB & $
  data: AB & $
}

export type O = {
  valid: boolean
}

export default class Verify extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['opt', 'algorithm', 'key', 'signature', 'data'],
        o: ['valid'],
      },
      {
        input: {
          algorithm: {
            ref: true,
          },
          key: {
            ref: true,
          },
          data: {
            ref: true,
          },
        },
      },
      system,
      ID_VERIFY
    )
  }

  async f(
    { key, algorithm, signature, data }: I,
    done: Done<O>
  ): Promise<void> {
    const {
      api: {
        crypto: { verify },
      },
    } = this.__system

    const key_ = (await key.raw()) as CryptoKey
    const algorithm_ = (await algorithm.raw()) as AlgorithmIdentifier
    const data_ = (await data.raw()) as ArrayBuffer
    const signature_ = (await signature.raw()) as ArrayBuffer

    let valid: boolean

    try {
      valid = await verify(algorithm_, key_, signature_, data_)
    } catch (err) {
      done(undefined, err.message.toLowerCase())

      return
    }

    done({ valid })
  }
}
