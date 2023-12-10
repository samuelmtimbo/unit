import { Callback } from '../Callback'
import { Unlisten } from '../Unlisten'

export interface OB {
  observe(object: Element, callback: Callback<any>): Unlisten
}
