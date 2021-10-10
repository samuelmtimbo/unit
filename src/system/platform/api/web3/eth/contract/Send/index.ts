import {
  sendToContract,
  sendTransaction,
  TransactionConfig,
  TransactionReceipt,
} from '../../../../../../../api/web3'
import { Functional } from '../../../../../../../Class/Functional'
import { Done } from '../../../../../../../Class/Functional/Done'
import { Config } from '../../../../../../../Class/Unit/Config'

export type I = {
  from: string
  value: number
  addr: string
  method: string
  args: any[]
}

export type O = {
  receipt: TransactionReceipt
}

export default class Send extends Functional {
  constructor(config?: Config) {
    super(
      {
        i: ['from', 'value', 'addr', 'method', 'args'],
        o: ['receipt'],
      },
      config,
      {}
    )
  }

  async f(
    { from, value, addr, method, args }: I,
    done: Done<O>
  ): Promise<void> {
    try {
      const receipt = await sendToContract(
        {
          from: from.toString().toUpperCase(),
          value: value.toString(),
        },
        addr,
        method,
        args
      )

      done({ receipt })
    } catch (err) {
      const { message } = err
      if (
        message ===
        `Provided address ${from} is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted.`
      ) {
        done(undefined, 'invalid "from" address')
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
