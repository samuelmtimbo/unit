import { BasicHTTPResponse } from '../../API'

export interface SRES {
  send(response: BasicHTTPResponse, body: Body): Promise<void>
}
