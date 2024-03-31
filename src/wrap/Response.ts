import { $ } from '../Class/$'
import { System } from '../system'
import { RES } from '../types/interface/RES'

export function wrapResponse(response: Response, system: System): RES & $ {
  const $response = new (class Response_ extends $ implements RES {
    __: string[] = ['RES']

    toJson(): Promise<any> {
      return response.json()
    }

    toText(): Promise<string> {
      return response.text()
    }

    toBlob(): Promise<Blob> {
      return response.blob()
    }
  })(system)

  return $response
}
