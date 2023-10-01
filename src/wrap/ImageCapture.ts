import { $ } from '../Class/$'
import { System } from '../system'
import { IC } from '../types/interface/IC'

export function wrapImageCapture(
  imageCapture: ImageCapture,
  system: System
): IC {
  const camera = new (class Camera extends $ implements IC {
    __: string[] = ['IC']

    grabFrame(): Promise<ImageBitmap> {
      return imageCapture.grabFrame()
    }
  })(system)

  return camera
}
