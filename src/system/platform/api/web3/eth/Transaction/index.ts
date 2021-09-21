import { sendTransaction, TransactionConfig } from '../../../../../../api/web3'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Config } from '../../../../../../Class/Unit/Config'
import { E } from '../../../../../../interface/E'

export type I = {
  init: TransactionConfig
}

export type O = {
  receipt: E
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

    this.addListener('take_err', () => {
      this._backward_all()
    })
  }

  async f({ init }: I, done: Done<O>): Promise<void> {
    const _init = {
      from: init.from.toString().toUpperCase(),
      to: init.to.toString().toUpperCase(),
      value: init.value.toString(),
    }

    try {
      const data = await sendTransaction(_init)

      this._output.receipt.push(data)
    } catch (err) {
      const { message } = err
      if (
        message ===
        `Provided address ${init.from} is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted.`
      ) {
        this.err('invalid "from" address')
      } else if (
        message ===
        `Provided address ${init.to} is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted.`
      ) {
        this.err('invalid "to" address')
      } else if (
        message === 'MetaMask Tx Signature: User denied transaction signature.'
      ) {
        this.err('user refused transaction')
      } else {
        this.err(err.message)
      }
      return
    }
  }
}
