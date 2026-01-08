import { $ } from '../Class/$'
import { LockedReadableStreamError } from '../exception/LockedReadableStreamError'
import { System } from '../system'
import { RS } from '../types/interface/RS'

export function wrapReadableStream(
  readableStream_: ReadableStream,
  system: System
): RS & $ {
  const readableStream = new (class ReadableStream_ extends $ implements RS {
    __: string[] = ['RS']

    async json(): Promise<any> {
      if (readableStream_.locked) {
        throw new LockedReadableStreamError()
      }

      return new Response(readableStream_).json()
    }

    async text(): Promise<string> {
      if (readableStream_.locked) {
        throw new LockedReadableStreamError()
      }

      return new Response(readableStream_).text()
    }

    async blob(): Promise<Blob> {
      if (readableStream_.locked) {
        throw new LockedReadableStreamError()
      }

      return new Response(readableStream_).blob()
    }

    async raw() {
      return readableStream_
    }

    async arrayBuffer(): Promise<ArrayBuffer> {
      if (readableStream_.locked) {
        throw new LockedReadableStreamError()
      }

      return new Response(readableStream_).arrayBuffer()
    }
  })(system)

  return readableStream
}
