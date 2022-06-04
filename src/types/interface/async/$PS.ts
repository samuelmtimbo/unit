import '../../client/document'
import { Callback } from '../../Callback'

export interface $PS {
  $requestPictureInPicture(
    data: {},
    callback: Callback<PictureInPictureWindow>
  ): void
}
