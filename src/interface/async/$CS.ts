import { Callback } from '../../types/Callback'
import { Unlisten } from '../../types/Unlisten'

export type CSOpt = { frameRate: number }

export interface $CS {
  $captureStream(
    { frameRate }: CSOpt,
    callback: Callback<MediaStream>
  ): Unlisten
}
