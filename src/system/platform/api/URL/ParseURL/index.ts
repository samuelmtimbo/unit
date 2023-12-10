import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_PARSE_URL } from '../../../../_ids'

export interface UrlObject {
  protocol: string
  hostname: string
  pathname: string
  search: string
  hash: string
  port: string
  host: string
  href: string
  origin: string
}

export interface I<T> {
  url: string
}

export interface O<T> {
  obj: UrlObject
}

export default class ParseUrl<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['url'],
        o: ['obj'],
      },
      {},
      system,
      ID_PARSE_URL
    )
  }

  async f({ url }: I<T>, done: Done<O<T>>): Promise<void> {
    const {
      api: {
        // url: { URL },
      },
    } = this.__system

    let obj: UrlObject

    try {
      const urlParser = new URL(url)

      obj = {
        protocol: urlParser.protocol,
        hostname: urlParser.hostname,
        pathname: urlParser.pathname,
        search: urlParser.search,
        hash: urlParser.hash,
        host: urlParser.host,
        href: urlParser.href,
        origin: urlParser.origin,
        port: urlParser.port,
      }
    } catch (err) {
      done(undefined, 'invalid url')

      return
    }

    done({ obj })
  }
}
