import { ServerResponse } from '../API'
import { $ } from '../Class/$'
import { ObjectPathTooDeepError } from '../exception/ObjectPathTooDeep'
import { ReadOnlyError } from '../exception/ObjectReadOnly'
import { NOOP } from '../NOOP'
import { ObjectUpdateType } from '../ObjectUpdateType'
import { System } from '../system'
import { headersToObj } from '../system/platform/api/http/Handle'
import { RES } from '../types/interface/RES'
import { Unlisten } from '../types/Unlisten'
import { wrapReadableStream } from './ReadableStream'

export type UsedBody = string | Blob | ArrayBuffer

export function usedBodyToString(usedBody: UsedBody): string {
  if (typeof usedBody === 'string') {
    return usedBody
  } else {
    return ''
  }
}

export function wrapResponse(response: Response, system: System): RES & $ {
  const $response = new (class Response_ extends $ implements RES {
    __: string[] = ['RES']

    _body: UsedBody

    read(): any {
      const res: ServerResponse = {
        url: response.url,
        type: response.type,
        status: response.status,
        statusText: response.statusText,
        redirected: response.redirected,
        bodyUsed: response.bodyUsed,
        headers: headersToObj(response.headers),
        body: usedBodyToString(this._body ?? ''),
        ok: response.ok,
      }

      return res
    }

    write(data: ServerResponse): void {
      throw new ReadOnlyError('')
    }

    async json(): Promise<any> {
      this._body = await response.json()

      return this._body
    }

    async text(): Promise<string> {
      this._body = await response.text()

      return this._body
    }

    async blob(): Promise<Blob> {
      this._body = await response.blob()

      return this._body
    }

    async arrayBuffer(): Promise<ArrayBuffer> {
      this._body = await response.arrayBuffer()

      return this._body
    }

    raw() {
      return response
    }

    get<K extends keyof ServerResponse>(name: K): any {
      if (name === 'body') {
        return wrapReadableStream(response.body, system)
      }

      if (name === 'headers') {
        return headersToObj(response.headers)
      }

      return response[name]
    }

    set<K extends keyof ServerResponse>(
      name: K,
      data: ServerResponse[K]
    ): Promise<void> {
      throw new ReadOnlyError('request')
    }

    delete<K extends keyof ServerResponse>(name: K): Promise<void> {
      throw new ReadOnlyError('request')
    }

    hasKey(name: string): boolean {
      return response[name] !== undefined
    }

    keys(): string[] {
      return Object.keys(response)
    }

    deepGet(path: string[]): any {
      if (path.length > 1) {
        throw new ObjectPathTooDeepError()
      }

      if (path.length === 0) {
        return this
      }

      // @ts-ignore
      return this.get(path[0])
    }

    deepSet(path: string[], data: any): Promise<void> {
      throw new ReadOnlyError('request')
    }

    deepDelete(path: string[]): Promise<void> {
      throw new ReadOnlyError('request')
    }

    deepHas(path: string[]): boolean {
      try {
        this.deepGet(path)

        return true
      } catch (err) {
        return false
      }
    }

    subscribe(
      path: string[],
      key: string,
      listener: (
        type: ObjectUpdateType,
        path: string[],
        key: string,
        data: any
      ) => void
    ): Unlisten {
      return NOOP
    }
  })(system)

  return $response
}
