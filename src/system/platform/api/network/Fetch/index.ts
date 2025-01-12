import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { isUnsafePort } from '../../../../../util/fetch'
import { ID_FETCH } from '../../../../_ids'
import { headerToObj } from '../../http/Handle'

export type I = {
  url: string
  opt: RequestInit
}

export type O = {
  response: {
    status: number
    body: string
    url: string
    bodyUsed: boolean
    headers: object
    redirected: boolean
    ok: boolean
    statusText: string
    type: string
  }
}

export default class Fetch extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['url', 'opt'],
        o: ['response'],
      },
      {},
      system,
      ID_FETCH
    )
  }

  async f({ url, opt }: I, done: Done<O>) {
    const {
      api: {
        http: { fetch },
      },
      cache: { servers, interceptors },
    } = this.__system

    const { port } = new URL(url)

    if (isUnsafePort(Number.parseInt(port))) {
      done(undefined, 'unsafe port')

      return
    }

    try {
      const { method = 'GET' } = opt

      if (method === 'GET' || method === 'HEAD') {
        delete opt.body
      }

      fetch(url, opt, servers, interceptors)
        .then(async (response: Response) => {
          const {
            bodyUsed,
            headers,
            redirected,
            ok,
            status,
            statusText,
            type,
          } = response

          return response.text().then((text) => {
            done({
              response: {
                url,
                status,
                bodyUsed,
                headers: headerToObj(headers),
                redirected,
                ok,
                statusText,
                type,
                body: text,
              },
            })
          })
        })
        .catch((err) => {
          if (
            err.message.toLowerCase() ===
            "failed to execute 'fetch' on 'window': request with get/head method cannot have body."
          ) {
            done(undefined, 'GET/HEAD request cannot have body')

            return
          }

          if (
            err.message.startsWith(
              "Failed to execute 'fetch' on 'Window': Failed to parse URL from "
            )
          ) {
            done(undefined, 'failed to parse url')

            return
          }

          done(undefined, err.message.toLowerCase())
        })
    } catch (err) {
      // console.log(err)

      done(undefined, 'malformed')
    }
  }
}
