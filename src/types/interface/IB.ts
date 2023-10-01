import { IM } from './IM'

export interface IB extends IM {
  imageBitmap(): Promise<ImageBitmap>
}
