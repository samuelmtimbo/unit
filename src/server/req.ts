import { Request, Response } from 'express'
import { UserSpec } from './model/UserSpec'

export interface Req extends Request {
  user?: UserSpec
  sessionId?: string
}

export interface Res extends Response {}
