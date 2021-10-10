import { getAccounts } from '../../../../../../api/web3'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Config } from '../../../../../../Class/Unit/Config'
import NOOP from '../../../../../../NOOP'

export type I = {
  init: any
}

export type O = {
  accs: string[]
}

export default class GetAccounts extends Functional {
  constructor(config?: Config) {
    super(
      {
        i: ['init'],
        o: ['accs'],
      },
      config,
      {}
    )
  }

  async f({ init }: I, done: Done<O>) {
    const accs = await getAccounts(NOOP)
    done({ accs })
  }
}
