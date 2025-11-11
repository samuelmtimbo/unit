import cors from 'cors'
import express from 'express'
import createError from 'http-errors'
import { PATH_PUBLIC } from '../path'
import { LOCAL_IP_ADDRESS } from './ip'
import { files } from './middleware'
import { PORT } from './port'
import compression = require('compression')

/* eslint-disable no-console */

export type ServerOpt = {
  port?: string | number
}

export function serve(opt: ServerOpt = { port: PORT }) {
  const { port = PORT } = opt

  const app = express()

  app.disable('x-powered-by')

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

  app.set('port', port)
  app.use(cors(corsOptions))
  // @ts-ignore
  app.use(compression())
  app.use(express.static(PATH_PUBLIC))
  app.use(files())
  app.use('*', express.static(PATH_PUBLIC))

  app.use(function (req, res, next) {
    next(createError(404))
  })

  function onListening() {
    console.log(`http://localhost:${port}`)
    console.log(`http://${LOCAL_IP_ADDRESS}:${port}`)
  }

  function onError(error) {
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

  const server = app.listen(port, onListening)

  server.on('error', onError)

  return server
}
