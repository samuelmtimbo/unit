import {
  IHTTPClientRequest,
  IHTTPServerResponse,
} from '../../system/platform/api/http/HTTPServer/index'
import { Callback } from '../Callback'
import { Unlisten } from '../Unlisten'

export interface IHTTPServer {
  listen: (
    port: number,
    listener: (
      req: IHTTPClientRequest,
      done: Callback<IHTTPServerResponse>
    ) => void
  ) => Unlisten
}

export interface IHTTPServerOpt {
  timeout: number
}
