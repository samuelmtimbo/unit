import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { AB } from '../../../../../types/interface/AB'
import { CK } from '../../../../../types/interface/CK'
import { J } from '../../../../../types/interface/J'
import { wrapArrayBuffer } from '../../../../../wrap/ArrayBuffer'
import { ID_DECRYPT } from '../../../../_ids'

export type I = {
  key: CK & $
  algorithm: J<any> & $
  data: AB & $
  opt: {}
}

export type O = {
  data: AB & $
}

export default class Decrypt extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['algorithm', 'key', 'data', 'opt'],
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
          data: {
            ref: true,
          },
        },
      },
      system,
      ID_DECRYPT
    )
  }

  async f({ opt, key, algorithm, data }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        crypto: { decrypt },
      },
    } = this.__system

    const key_ = (await key.raw()) as CryptoKey
    const algorithm_ = (await algorithm.raw()) as AlgorithmIdentifier
    const data_ = (await data.raw()) as ArrayBuffer

    let _data: ArrayBuffer

    try {
      _data = await decrypt(algorithm_, key_, data_)
    } catch (err) {
      if (err.name === 'OperationError') {
        done(undefined, 'operation error')

        return
      }

      done(undefined, err.message.toLowerCase())

      return
    }

    const __data = wrapArrayBuffer(_data, this.__system)

    done({ data: __data })
  }
}
