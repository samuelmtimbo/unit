import { API } from '../../../../API'
import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { BootOpt } from '../../../../system'

export function webGeolocation(
  window: Window,
  opt: BootOpt
): API['geolocation'] {
  const { navigator } = window

  const getCurrentPosition = async (): Promise<GeolocationCoordinates> => {
    if (
      !navigator ||
      !navigator.geolocation ||
      !navigator.geolocation.getCurrentPosition
    ) {
      throw new APINotSupportedError('Geolocation')
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position.coords)
      })
    })
  }

  const geolocation: API['geolocation'] = {
    getCurrentPosition,
  }

  return geolocation
}
