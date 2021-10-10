import {
  sendTransaction,
  TransactionConfig,
  TransactionReceipt,
} from '../../../../../../api/web3'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Config } from '../../../../../../Class/Unit/Config'

export type I = {
  init: TransactionConfig
}

export type O = {
  receipt: TransactionReceipt
}

export default class Transaction extends Functional {
  constructor(config?: Config) {
    super(
      {
        i: ['init'],
        o: ['receipt'],
      },
      config,
      {}
    )
  }

  async f({ init }: I, done: Done<O>): Promise<void> {
    const _init = {
      from: init.from.toString().toUpperCase(),
      to: init.to.toString().toUpperCase(),
      value: init.value.toString(),
    }

    try {
      const receipt = await sendTransaction(_init)
      done({ receipt })
    } catch (err) {
      const { message } = err
      if (
        message ===
        `Provided address ${init.from} is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted.`
      ) {
        done(undefined, 'invalid "from" address')
      } else if (
        message ===
        `Provided address ${init.to} is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted.`
      ) {
        done(undefined, 'invalid "to" address')
      } else if (
        message === 'MetaMask Tx Signature: User denied transaction signature.'
      ) {
        done(undefined, 'user refused transaction')
      } else {
        done(undefined, message)
      }
    }
  }
}
