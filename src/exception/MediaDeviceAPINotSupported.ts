import { APINotSupportedError } from './APINotImplementedError'

export class MediaDevicesAPINotSupported extends APINotSupportedError {
  constructor() {
    super('Media Devices')
  }
}
