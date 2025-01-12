import { ServerHandler } from '../../API'
import { Dict } from '../Dict'
import { Unlisten } from '../Unlisten'

export interface SE {
  listen(port: number, handler: ServerHandler, servers: Dict<any>): Unlisten
}
