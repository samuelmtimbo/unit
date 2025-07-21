import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { AB } from '../../../../../types/interface/AB'
import { CK } from '../../../../../types/interface/CK'
import { J } from '../../../../../types/interface/J'
import { wrapArrayBuffer } from '../../../../../wrap/ArrayBuffer'
import { ID_ENCRYPT } from '../../../../_ids'

export type I = {
  key: CK & $
  algorithm: J<any> & $
  data: AB & $
}

export type O = {
  signature: AB & $
}

export default class Sign extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['opt', 'algorithm', 'key', 'data'],
        fo: ['data'],
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
        output: {
          signature: {
            ref: true,
          },
        },
      },
      system,
      ID_ENCRYPT
    )
  }

  async f(
    { key, algorithm, data }: I,
    done: Done<O>,
    fail: Fail
  ): Promise<void> {
    const {
      api: {
        crypto: { sign },
      },
    } = this.__system

    const key_ = (await key.raw()) as CryptoKey
    const algorithm_ = (await algorithm.raw()) as AlgorithmIdentifier
    const data_ = (await data.raw()) as ArrayBuffer

    let _signature: ArrayBuffer

    try {
      _signature = (await sign(algorithm_, key_, data_)) as ArrayBuffer
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    const signature = wrapArrayBuffer(_signature, this.__system)

    done({ signature })
  }
}
