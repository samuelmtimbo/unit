import {
  deployContract,
  TransactionReceipt,
} from '../../../../../../../api/web3'
import { Functional } from '../../../../../../../Class/Functional'
import { Done } from '../../../../../../../Class/Functional/Done'
import { Config } from '../../../../../../../Class/Unit/Config'

export type I = {
  from: string
  abi: any
  data: string
  args: any[]
}

export type O = {
  receipt: TransactionReceipt
}

export default class Deploy extends Functional {
  constructor(config?: Config) {
    super(
      {
        i: ['from', 'abi', 'data', 'args'],
        o: ['receipt'],
      },
      config,
      {}
    )
  }

  async f({ from, abi, data, args }: I, done: Done<O>): Promise<void> {
    from = from.toString().toUpperCase()

    try {
      const receipt = await deployContract({ from }, abi, data, args)

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
