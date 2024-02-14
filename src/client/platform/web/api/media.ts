import { API } from '../../../../API'
import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { DisplayMediaAPINotSupported } from '../../../../exception/DisplayMediaAPINotSupported'
import { MediaDevicesAPINotSupported } from '../../../../exception/MediaDeviceAPINotSupported'
import { BootOpt } from '../../../../system'
import { Rect } from '../../../util/geometry/types'

export function webMedia(window: Window, opt: BootOpt): API['media'] {
  const media: API['media'] = {
    getUserMedia: async (opt: MediaStreamConstraints): Promise<MediaStream> => {
      if (!navigator || !navigator.mediaDevices) {
        throw new MediaDevicesAPINotSupported()
      }

      if (!navigator.mediaDevices.getUserMedia) {
        throw new MediaDevicesAPINotSupported()
      }

      try {
        return await navigator.mediaDevices.getUserMedia(opt)
      } catch (err) {
        const { message } = err

        if (
          message ===
          "Failed to execute 'getUserMedia' on 'MediaDevices': At least one of audio and video must be requested"
        ) {
          throw new Error('at least one of audio or video must be requested')
        }

        throw err
      }
    },
    getDisplayMedia: async (
      opt: DisplayMediaStreamOptions
    ): Promise<MediaStream> => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new DisplayMediaAPINotSupported()
      }

      try {
        return navigator.mediaDevices.getDisplayMedia(opt)
      } catch (err) {
        throw new Error(err.message)
      }
    },
    enumerateDevices: async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        throw new APINotSupportedError('Enumerate Media Devices')
      }

      return navigator.mediaDevices.enumerateDevices()
    },
    image: {
      createImageBitmap: function (
        image: ImageBitmapSource,
        rect: Partial<Rect>,
        opt: {}
      ): Promise<ImageBitmap> {
        if (
          rect.x !== undefined &&
          rect.y !== undefined &&
          rect.width !== undefined &&
          rect.height !== undefined
        ) {
          return window.createImageBitmap(
            image,
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            opt
          )
        } else {
          return window.createImageBitmap(image, opt)
        }
      },
    },
  }

  return media
}
