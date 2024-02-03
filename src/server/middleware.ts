import { NextFunction, Request, RequestHandler, Response } from 'express'
import * as path from 'path'
import { PATH_PUBLIC } from '../path'
import { last } from '../util/array'

function isFilename(name: string): boolean {
  const filenameRegex = /^([a-zA-Z0-9_-]+)\.[.a-zA-Z0-9]+$/

  return filenameRegex.test(name)
}

export function files(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const segments = req.path.split('/')

    const name = last(segments) || last(segments, -1)

    if (isFilename(name)) {
      res.sendFile(path.join(PATH_PUBLIC, name))

      return
    }

    next()
  }
}
