import { Callback } from '../Callback'
import { Unlisten } from '../Unlisten'

export interface E {
  listen: (event: string, callback: Callback) => Unlisten
}
