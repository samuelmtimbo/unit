import { $ } from '../Class/$'
import { System } from '../system'
import { RES } from '../types/interface/RES'

export function wrapRequest(_request: Request, system: System): RES & $ {
  const request = new (class Request_ extends $ implements RES {
    __: string[] = ['REQ']

    json(): Promise<any> {
      return _request.json()
    }

    text(): Promise<string> {
      return _request.text()
    }

    blob(): Promise<Blob> {
      return _request.blob()
    }
  })(system)

  return request
}
