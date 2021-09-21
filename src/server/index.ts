#!/usr/bin/env node

import * as cors from 'cors'
import _debug from 'debug'
import * as express from 'express'
import * as http from 'http'
import * as createError from 'http-errors'
import * as os from 'os'
import * as path from 'path'
import compression = require('compression')

const debug = _debug('')

export const PORT = 4000

process.on('uncaughtException', function (err) {
  console.error(new Date().toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

console.log(
  Object.values(os.networkInterfaces()).reduce(
    (r, list) =>
      r.concat(
        list.reduce(
          (rr, i) =>
            rr.concat((i.family === 'IPv4' && !i.internal && i.address) || []),
          []
        )
      ),
    []
  )[0]
)

export let server: http.Server | null = null

const app = express()

// app.use((req, res, next) => {
//   const { url } = req
//   console.log('url', url)
//   next()
// })

const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

app.use(compression())

const CWD = process.cwd()

const PUBLIC_PATH = path.join(CWD, 'public')

app.use(express.static(PUBLIC_PATH))

server = app.listen(PORT, onListening)

app.set('port', PORT)

server.on('error', onError)

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT

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

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.log('Listening on ' + bind)
  debug('Listening on ' + bind)
}

app.use(function (req, res, next) {
  next(createError(404))
})
