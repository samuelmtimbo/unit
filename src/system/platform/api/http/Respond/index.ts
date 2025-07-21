import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { BO } from '../../../../../types/interface/BO'
import { ID_RESPOND } from '../../../../_ids'

export type I = {
  url: string
  body: BO & $
  status: number
  headers: Dict<string>
}

export type O = {
  done: true
}

export default class Respond extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['url', 'body', 'status', 'headers'],
        fo: [],
        o: ['done'],
      },
      {
        input: {
          body: {
            ref: true,
          },
        },
      },
      system,
      ID_RESPOND
    )
  }

  async f(
    { url, status, headers, body }: I,
    done: Done<O>,
    fail: Fail
  ): Promise<void> {
    const {
      cache: { responses },
    } = this.__system

    const waiter = responses[url]

    if (!waiter) {
      fail('could not find request')

      return
    }

    const raw = await body.raw()

    const ok = status >= 200 && status < 300

    const type: ResponseType = 'basic'

    waiter.set({
      status,
      statusText: 'OK',
      headers,
      body: raw,
      redirected: false,
      bodyUsed: false,
      ok,
      url,
      type,
    })

    done()
  }

  b() {
    this._output.done.push(true)
  }
}
