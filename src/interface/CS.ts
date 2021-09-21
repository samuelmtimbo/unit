import { CSOpt } from '../async/$CS'
import { Callback } from '../Callback'
import { Unlisten } from '../Unlisten'

export interface CS<I = any, O = any> {
  captureStream(opt: CSOpt, callback: Callback<MediaStream>): Unlisten
}
