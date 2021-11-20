import { Callback } from '../Callback'
import { Unlisten } from '../Unlisten'

export interface EE {
  addListener: (name: string, callback: Callback) => Unlisten
}
