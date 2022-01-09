import { Callback } from '../types/Callback'
import { Unlisten } from '../types/Unlisten'
import { CSOpt } from './async/$CS'

export interface CS {
  captureStream(opt: CSOpt, callback: Callback<MediaStream>): Unlisten
}
