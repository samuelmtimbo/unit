import { Callback } from '../types/Callback'
import { Unlisten } from '../types/Unlisten'

export interface ST {
  stream(callback: Callback<MediaProvider>): Unlisten
}
