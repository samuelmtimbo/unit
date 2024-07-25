import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
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
  data: AB & $
}

export default class Encrypt extends Holder<I, O> {
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
          data: {
            ref: true,
          },
        },
      },
      system,
      ID_ENCRYPT
    )
  }

  async f({ key, algorithm, data }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        crypto: { encrypt },
      },
    } = this.__system

    const key_ = (await key.raw()) as CryptoKey
    const algorithm_ = (await algorithm.raw()) as AlgorithmIdentifier
    const data_ = (await data.raw()) as ArrayBuffer

    let _data: ArrayBuffer

    try {
      _data = (await encrypt(algorithm_, key_, data_)) as ArrayBuffer
    } catch (err) {
      if (err.message) {
        done(undefined, err.message.toLowerCase())
      } else {
        if (err.name === 'OperationError') {
          done(undefined, 'encrypt operation error')
        } else {
          done(undefined, 'encrypt failed for an unknown reason')
        }
      }

      return
    }

    const __data = wrapArrayBuffer(_data, this.__system)

    done({ data: __data })
  }
}
