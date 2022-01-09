import { APINotSupportedError } from './APINotImplementedError'

export class DisplayMediaAPINotSupported extends APINotSupportedError {
  constructor() {
    super('Display Media')
  }
}
