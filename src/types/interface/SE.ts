import { ServerHandler } from '../../API'
import { Callback } from '../Callback'
import { Unlisten } from '../Unlisten'

export interface SE {
  listen(port: number, handler: ServerHandler, onerror: Callback): Unlisten
}
