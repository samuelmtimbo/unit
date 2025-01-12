import { ServerRequest } from '../../../../../API'
import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { RS } from '../../../../../types/interface/RS'
import { wrapReadableStream } from '../../../../../wrap/ReadableStream'
import { ID_HANDLE } from '../../../../_ids'

export type I = {
  url: string
}

export type O = {
  body: RS & $
  request: ServerRequest
  url: string
}

export function headerToObj(headers_: Response['headers']) {
  const headers = {}

  headers_.forEach((value: string, key: string) => {
    headers[key] = value
  })

  return headers
}

export default class Handle extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['url'],
        fo: ['request', 'body', 'url'],
        i: [],
        o: [],
      },
      {
        output: {
          body: {
            ref: true,
          },
        },
      },
      system,
      ID_HANDLE,
      'done'
    )
  }

  async f({ url: url_ }: I, done: Done<O>): Promise<void> {
    const {
      cache: { requests },
    } = this.__system

    const { url, method, headers, body: body_ } = requests[url_]

    const body = wrapReadableStream(body_, this.__system)

    const { search, pathname, hostname, origin, protocol, port } = new URL(url)

    const request: ServerRequest = {
      url,
      headers,
      search,
      query: Object.fromEntries(new URLSearchParams(search)),
      method,
      path: pathname,
      hostname,
      origin,
      body: undefined,
      protocol,
      port,
    }

    done({
      url: url_,
      request,
      body,
    })
  }

  d() {
    //
  }
}
