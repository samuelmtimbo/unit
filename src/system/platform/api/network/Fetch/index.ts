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

  f({ url, options }: I, done: Done<O>) {
    const {
      api: {
        http: { fetch },
      },
    } = this.__system

    fetch(url, options)
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
        done(undefined, err.message.toLowerCase())
      })
  }
}
