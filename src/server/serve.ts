import { createReadStream, existsSync, statSync } from 'node:fs'
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http'
import { extname, join, normalize, sep } from 'node:path'
import { PATH_PUBLIC } from '../path'
import { LOCAL_IP_ADDRESS } from './ip'
import { files } from './middleware'
import { PORT } from './port'

/* eslint-disable no-console */

export type ServerOpt = {
  port?: string | number
}

type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: (error?: Error | null) => void
) => void

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
}

function sendText(res: ServerResponse, statusCode: number, message: string) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
  })
  res.end(message)
}

function serveStatic(
  req: IncomingMessage,
  res: ServerResponse,
  publicDir: string
): boolean {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return false
  }

  let pathname: string

  try {
    pathname = decodeURIComponent(
      new URL(req.url ?? '/', 'http://localhost').pathname
    )
  } catch {
    sendText(res, 400, 'Bad Request')
    return true
  }

  // Prevent directory traversal.
  const relativePath = normalize(pathname.replace(/^[/\\]+/, ''))
  const root = normalize(publicDir)
  const filePath = join(root, relativePath)

  if (
    relativePath === '..' ||
    relativePath.startsWith(`..${sep}`) ||
    (filePath !== root && !filePath.startsWith(root + sep))
  ) {
    sendText(res, 403, 'Forbidden')
    return true
  }

  let target = filePath

  try {
    if (existsSync(target) && statSync(target).isDirectory()) {
      target = join(target, 'index.html')
    }

    if (!existsSync(target) || !statSync(target).isFile()) {
      return false
    }

    const stat = statSync(target)
    const contentType =
      MIME_TYPES[extname(target).toLowerCase()] ?? 'application/octet-stream'

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
    })

    if (req.method === 'HEAD') {
      res.end()
    } else {
      const stream = createReadStream(target)

      stream.on('error', (error) => {
        console.error('Static file read error:', error)

        if (!res.headersSent) {
          sendText(res, 500, 'Internal Server Error')
        } else {
          res.destroy(error)
        }
      })

      stream.pipe(res)
    }

    return true
  } catch (error) {
    console.error('Static file error:', error)
    sendText(res, 500, 'Internal Server Error')
    return true
  }
}

export function serve(opt: ServerOpt = { port: PORT }) {
  const { port = PORT } = opt

  const fileMiddleware = files() as Middleware

  const server = createServer((req, res) => {
    const { url, method } = req

    console.log(method, url)

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS'
    )
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if (method === 'OPTIONS') {
      res.writeHead(200)
      res.end()
      return
    }

    if (serveStatic(req, res, PATH_PUBLIC)) {
      return
    }

    fileMiddleware(req, res, (error) => {
      if (res.writableEnded || res.destroyed) {
        return
      }

      if (error) {
        console.error(error)
        sendText(res, 500, 'Internal Server Error')
        return
      }

      if (serveStatic(req, res, PATH_PUBLIC)) {
        return
      }

      sendText(res, 404, 'Not Found')
    })
  })

  function onListening() {
    console.log(`http://localhost:${port}`)
    console.log(`http://${LOCAL_IP_ADDRESS}:${port}`)
  }

  function onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
        break
      default:
        throw error
    }
  }

  server.on('error', onError)
  server.listen(port, onListening)

  return server
}
