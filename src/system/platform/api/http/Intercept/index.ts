import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { S } from '../../../../../types/interface/S'
import { ID_INTERCEPT } from '../../../../_ids'
import { makeHandler } from '../Listen'

export type I = {
  opt: {
    urls: string[]
  }
  system: S & $
  stop: any
}

export type O = {
  url: string
}

export default class Intercept extends Holder<I, O> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['system', 'opt'],
        fo: [],
        i: [],
        o: ['url'],
      },
      {
        input: {
          system: {
            ref: true,
          },
        },
      },
      system,
      ID_INTERCEPT,
      'stop'
    )
  }

  async f({ system, opt }: I, done: Done<O>): Promise<void> {
    const handler = makeHandler(this.__system, (url) => {
      this._output.url.push(url)
    })

    this._unlisten = system.intercept(opt, handler)
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }
}
