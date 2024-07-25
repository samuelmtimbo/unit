import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { TA } from '../../../../../types/interface/TA'
import { wrapObject } from '../../../../../wrap/Object'
import { ID_RSA_ALGORITHM } from '../../../../_ids'

export type I = {
  name: string
  modulusLength: number
  publicExponent: TA & $
  hash: string
}

export type O = {
  algorithm: J & $
}

export default class RsaAlgorithm extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['name', 'modulusLength', 'publicExponent', 'hash'],
        fo: ['algorithm'],
      },
      {
        input: {
          publicExponent: {
            ref: true,
          },
        },
        output: {
          algorithm: {
            ref: true,
          },
        },
      },
      system,
      ID_RSA_ALGORITHM
    )
  }

  async f(
    { name, modulusLength, publicExponent, hash }: I,
    done: Done<O>
  ): Promise<void> {
    const algorithm_ = {
      name,
      modulusLength,
      publicExponent: publicExponent.raw(),
      hash,
    }

    const algorithm = wrapObject(algorithm_, this.__system)

    done({ algorithm })
  }
}
