import '../../client/document'
import { Callback } from '../../types/Callback'

export interface $PS {
  $requestPictureInPicture(
    data: {},
    callback: Callback<PictureInPictureWindow>
  ): void
}
