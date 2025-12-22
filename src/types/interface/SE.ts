import { ServerHandler } from '../../API'
import { Unlisten } from '../Unlisten'

export interface SE {
  listen(port: number, handler: ServerHandler): Unlisten
}
