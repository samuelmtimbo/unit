import * as http from 'http'
import { JSDOM } from 'jsdom'
import { BasicHTTPHandler, BasicHTTPRequest } from '../../../API'
import { BootOpt, System } from '../../../system'
import { Unlisten } from '../../../types/Unlisten'
import { SYSTEM_ROOT_ID } from '../../SYSTEM_ROOT_ID'
import { webBoot } from '../web/boot'
import { NoopCanvasRenderingContext2D } from './canvas'

export function boot(opt?: BootOpt): [System, Unlisten] {
  const { window } = new JSDOM(`<div id="${SYSTEM_ROOT_ID}"></div>`, {
    url: 'http://localhost/',
  })

  const root = window.document.getElementById(SYSTEM_ROOT_ID)

  window.fetch = fetch
  window.HTMLCanvasElement.prototype.getContext = <
    T extends '2d' | 'webgl' | 'webgl2' | 'bitmaprenderer',
  >(
    contextId: T
  ): T extends '2d' ? CanvasRenderingContext2D : any => {
    if (contextId === '2d') {
      return new NoopCanvasRenderingContext2D()
    }

    return null
  }

  // @ts-ignore
  const [system, unlisten] = webBoot(window, root, opt)

  system.api.http.listen = (port: number, handler: BasicHTTPHandler) => {
    const server = http.createServer(async (req, res) => {
      const _req: BasicHTTPRequest = {
        headers: { ...req.headers },
        method: req.method,
        path: req.url,
        body: '',
        search: '',
        query: {},
      }

      let data = ''
      req
        .on('data', (chunk) => {
          data += chunk
        })
        .on('end', async () => {
          _req.body = data

          const _res = await handler(_req)

          res.writeHead(_res.status, _res.body, _res.headers)
        })
    })

    server.listen(port)

    return () => {
      server.close()
    }
  }

  return [system, unlisten]
}
