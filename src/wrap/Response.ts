import { ServerResponse } from '../API'
import { $ } from '../Class/$'
import { ReadOnlyError } from '../exception/ObjectReadOnly'
import { System } from '../system'
import { headerToObj } from '../system/platform/api/http/Handle'
import { Callback } from '../types/Callback'
import { RES } from '../types/interface/RES'

export function wrapResponse(response: Response, system: System): RES & $ {
  const $response = new (class Response_ extends $ implements RES {
    __: string[] = ['RES']

    read(callback: Callback<ServerResponse>): void {
      ;(async () => {
        callback({
          status: response.status,
          headers: headerToObj(response.headers),
          body: await response.text(),
        })
      })()
    }

    write(data: ServerResponse, callback: Callback<undefined>): void {
      throw new ReadOnlyError('')
    }

    json(): Promise<any> {
      return response.json()
    }

    text(): Promise<string> {
      return response.text()
    }

    blob(): Promise<Blob> {
      return response.blob()
    }
  })(system)

  return $response
}
