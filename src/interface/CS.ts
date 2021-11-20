import { Callback } from '../Callback'
import { Unlisten } from '../Unlisten'
import { CSOpt } from './async/$CS'

export interface CS<I = any, O = any> {
  captureStream(opt: CSOpt, callback: Callback<MediaStream>): Unlisten
}
