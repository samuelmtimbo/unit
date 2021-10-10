import { callContract, TransactionReceipt } from '../../../../../../../api/web3'
import { Functional } from '../../../../../../../Class/Functional'
import { Done } from '../../../../../../../Class/Functional/Done'
import { Config } from '../../../../../../../Class/Unit/Config'

export type I = {
  from: string
  addr: string
  method: string
  args: any[]
}

export type O = {
  receipt: TransactionReceipt
}

export default class Call extends Functional {
  constructor(config?: Config) {
    super(
      {
        i: ['from', 'addr', 'method', 'args'],
        o: ['receipt'],
      },
      config,
      {}
    )
  }

  async f({ from, addr, method, args }: I, done: Done<O>): Promise<void> {
    from = from.toString().toUpperCase()

    try {
      const receipt = await callContract({ from }, addr, method, args)
      done({ receipt })
    } catch (err) {
      const { message } = err
      done(undefined, message)
    }
  }
}
