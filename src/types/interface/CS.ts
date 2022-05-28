import { CSOpt } from './async/$CS'

export interface CS {
  captureStream(opt: CSOpt): Promise<MediaStream>
}
