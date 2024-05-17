import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { BO } from '../../../../../types/interface/BO'
import { RES } from '../../../../../types/interface/RES'
import { wrapResponse } from '../../../../../wrap/Response'
import { ID_FETCH_0 } from '../../../../_ids'

export type I = {
  url: string
  opt: RequestInit
  body: BO & $
  done: any
}

export type O = {
  res: RES & $
}

export default class Fetch0 extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['url', 'opt', 'body'],
        fo: ['res'],
        i: ['done'],
        o: [],
      },
      {
        input: {
          body: {
            ref: true,
          },
        },
        output: {
          res: {
            ref: true,
          },
        },
      },
      system,
      ID_FETCH_0
    )
  }

  async f({ url, opt, body }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        http: { fetch },
      },
    } = this.__system

    opt.body = await body.raw()

    let response: Response

    try {
      response = await fetch(url, opt)
    } catch (err) {
      // console.log(err)

      done(undefined, 'malformed')

      return
    }

    const res = wrapResponse(response, this.__system)

    done({ res })
  }

  public onIterDataInputData(name: string, data: any): void {
    this._forward_empty('res')

    this._backward('body')
    this._backward('opt')
    this._backward('url')

    this._backward('done')
  }
}
