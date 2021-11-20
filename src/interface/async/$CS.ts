import { Callback } from '../../Callback'
import { Unlisten } from '../../Unlisten'

export type CSOpt = { frameRate: number }

export interface $CS {
  $captureStream(
    { frameRate }: CSOpt,
    callback: Callback<MediaStream>
  ): Unlisten
}
