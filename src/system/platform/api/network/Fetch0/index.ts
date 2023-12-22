import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { BO } from '../../../../../types/interface/BO'
import { RES } from '../../../../../types/interface/RES'
import { wrapResponse } from '../../../../../wrap/Response'
import { ID_FETCH_0 } from '../../../../_ids'

export type I = {
  url: string
  opt: RequestInit
  body?: BO & $
}

export type O = {
  res: RES & $
}

export default class Fetch0 extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['url', 'opt', 'body'],
        o: ['res'],
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
}
