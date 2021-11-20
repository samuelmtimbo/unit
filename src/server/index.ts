#!/usr/bin/env node

import * as cors from 'cors'
import * as express from 'express'
import * as http from 'http'
import * as createError from 'http-errors'
import * as os from 'os'
import * as path from 'path'
import ALL from './route'
import compression = require('compression')
import { PORT } from './port'

process.on('uncaughtException', function (err) {
  console.error(new Date().toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

const LOCAL_IP_ADDRESS = Object.values(os.networkInterfaces()).reduce(
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

export let server: http.Server | null = null

const app = express()

app.use((req, res, next) => {
  const { url, method } = req
  console.log(method, url)
  next()
})

const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

app.use(compression())

app.use('/_', ALL)

const CWD = process.cwd()

const PUBLIC_PATH = path.join(CWD, 'public')

app.use(express.static(PUBLIC_PATH))

app.use((req, res, next) => {
  console.log(req.path)
  res.sendStatus(404)
})

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
  console.log(`http://localhost:${PORT}`)
  console.log(`http://${LOCAL_IP_ADDRESS}:${PORT}`)
}

app.use(function (req, res, next) {
  next(createError(404))
})
