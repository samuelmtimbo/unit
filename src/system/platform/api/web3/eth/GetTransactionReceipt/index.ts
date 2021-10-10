import {
  getTransactionReceipt,
  TransactionReceipt,
} from '../../../../../../api/web3'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Config } from '../../../../../../Class/Unit/Config'

export type I = {
  hash: string
}

export type O = {
  receipt: TransactionReceipt
}

export default class GetTransactionReceipt extends Functional {
  constructor(config?: Config) {
    super(
      {
        i: ['hash'],
        o: ['receipt'],
      },
      config,
      {}
    )
  }

  async f({ hash }: I, done: Done<O>): Promise<void> {
    try {
      const receipt = await getTransactionReceipt(hash)
      done({ receipt })
    } catch (err) {
      const { message } = err
      done(undefined, message)
    }
  }
}
