import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_FETCH } from '../../../../_ids'

export type I = {
  url: string
  options: RequestInit
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
        i: ['url', 'options'],
        o: ['response'],
      },
      {},
      system,
      ID_FETCH
    )
  }

  private _fetch_index: number = 0

  f({ url, options }: I, done: Done<O>) {
    const {
      api: {
        http: { fetch },
      },
    } = this.__system

    const i = ++this._fetch_index

    try {
      fetch(url, options)
        .then((response) => {
          if (i !== this._fetch_index) {
            // request is outdated
            return
          }

          return response.text().then((text) => {
            if (i !== this._fetch_index) {
              // request is outdated
              return
            }

            done({
              response: {
                status: response.status,
                body: text,
              },
            })
          })
        })
        .catch((err) => {
          if (i !== this._fetch_index) {
            // request is outdated
            return
          }

          if (
            err.message.toLowerCase() ===
            "failed to execute 'fetch' on 'window': request with get/head method cannot have body."
          ) {
            done(undefined, 'request with GET/HEAD method cannot have body')

            return
          }

          done(undefined, err.message.toLowerCase())
        })
    } catch (err) {
      console.log(err)

      done(undefined, 'malformed')
    }
  }
}
