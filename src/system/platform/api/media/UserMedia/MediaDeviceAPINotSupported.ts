import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'

export class UserMediaAPINotSupported extends APINotSupportedError {
  constructor() {
    super('Media Devices')
  }
}
