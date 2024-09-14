import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_FETCH } from '../../../../_ids'

export type I = {
  url: string
  opt: RequestInit
}

export type O = {
  response: {
    status: number
    body: string
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
      cache: { servers },
    } = this.__system

    try {
      fetch(url, opt, servers)
        .then((response) => {
          return response.text().then((text) => {
            done({
              response: {
                status: response.status,
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
