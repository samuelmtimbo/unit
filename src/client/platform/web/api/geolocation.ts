import { API } from '../../../../API'
import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { BootOpt } from '../../../../system'
import { IGeoPosition } from '../../../../types/global/IGeoPosition'

export function webGeolocation(
  window: Window,
  opt: BootOpt
): API['geolocation'] {
  const { navigator } = window

  const getCurrentPosition = async (): Promise<IGeoPosition> => {
    if (
      !navigator ||
      !navigator.geolocation ||
      !navigator.geolocation.getCurrentPosition
    ) {
      throw new APINotSupportedError('Geolocation')
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
    })
  }

  const geolocation: API['geolocation'] = {
    getCurrentPosition,
  }

  return geolocation
}
