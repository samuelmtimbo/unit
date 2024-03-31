import { $ } from '../Class/$'
import { System } from '../system'
import { FR } from '../types/interface/FR'

export function waitFileReaderResult<T extends string | ArrayBuffer>(
  reader: FileReader
): Promise<T> {
  return new Promise((resolve, reject) => {
    const listener = function (event: ProgressEvent) {
      reader.removeEventListener('loadend', listener)

      const { error, result } = reader

      if (error) {
        reject(error.message)
      } else {
        resolve(result as T)
      }
    }

    reader.addEventListener('loadend', listener)
  })
}

export function wrapFileReader(reader: FileReader, system: System): FR & $ {
  const reader_ = new (class FileReader_ extends $ implements FR {
    __: string[] = ['FR']

    readAsDataUrl(blob: Blob): Promise<string> {
      reader.readAsDataURL(blob)

      return waitFileReaderResult<string>(reader)
    }
  })(system)

  return reader_
}
