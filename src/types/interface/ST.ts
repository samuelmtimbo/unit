import { Callback } from '../Callback'
import { Unlisten } from '../Unlisten'

export interface ST {
  stream(callback: Callback<MediaProvider>): Unlisten
}
