import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { BO } from '../../../../../types/interface/BO'
import { RES } from '../../../../../types/interface/RES'
import { isUnsafePort } from '../../../../../util/fetch'
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
  done: any
}

export default class Fetch extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['url', 'opt', 'body'],
        fo: ['res'],
        i: [],
        o: ['done'],
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

  async f({ url, opt, body }: I, done: Done<O>, fail: Fail): Promise<void> {
    const {
      api: {
        http: { fetch },
      },
      cache: { servers, interceptors },
    } = this.__system

    opt.body = await body.raw()

    let port: string

    try {
      ;({ port } = new URL(url))
    } catch (err) {
      fail('invalid url')

      return
    }

    if (isUnsafePort(Number.parseInt(port))) {
      fail('unsafe port')

      return
    }

    const { method = 'GET' } = opt

    if (method === 'GET' || method === 'HEAD') {
      delete opt.body
    }

    try {
      fetch(url, opt, servers, interceptors)
        .then((response) => {
          const res = wrapResponse(response, this.__system)

          done({ res })
        })
        .catch((err) => {
          if (err.message === 'Failed to fetch') {
            fail('failed to fetch')

            return
          }

          if (
            err.message.toLowerCase() ===
            "failed to execute 'fetch' on 'window': request with get/head method cannot have body."
          ) {
            fail('GET/HEAD request cannot have body')

            return
          }

          if (
            err.message.startsWith(
              "Failed to execute 'fetch' on 'Window': Failed to parse URL from "
            )
          ) {
            fail('failed to parse url')

            return
          }

          fail(err.message.toLowerCase())
        })
    } catch (err) {
      fail('malformed')

      return
    }
  }

  b() {
    this._output.done.push(true)
  }
}
