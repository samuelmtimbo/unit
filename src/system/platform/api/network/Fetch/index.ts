import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export type I = {
  url: string
  options: {
    body?: string | null
    headers?: { [header: string]: string }
    method?: string
  }
}

export type O = {
  response: {
    status: number
    body: string
  }
}

export default class Fetch extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['url', 'options'],
        o: ['response'],
      },
      config
    )
  }

  f({ url, options }: I, done: Done<O>) {
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
