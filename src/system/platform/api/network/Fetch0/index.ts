import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
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

export default class Fetch0 extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['url', 'opt', 'body'],
        fo: ['res'],
        i: [],
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
      cache: { servers, interceptors },
    } = this.__system

    opt.body = await body.raw()

    let response: Response

    try {
      response = await fetch(url, opt, servers, interceptors)
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        done(undefined, 'failed to fetch')

        return
      }

      done(undefined, 'malformed')

      return
    }

    const res = wrapResponse(response, this.__system)

    done({ res })
  }
}
