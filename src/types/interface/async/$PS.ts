import { Callback } from '../../Callback'
import '../../client/document'

export interface $PS {
  $requestPictureInPicture(
    data: {},
    callback: Callback<PictureInPictureWindow>
  ): void
}
