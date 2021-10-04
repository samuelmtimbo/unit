import { Callback } from '../Callback'

export interface PS<I = any, O = any> {
  requestPictureInPicture(callback: Callback<PictureInPictureWindow>): void
}
