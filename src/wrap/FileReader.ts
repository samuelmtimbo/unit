import { $ } from '../Class/$'
import { System } from '../system'
import { FR } from '../types/interface/FR'

export function waitFileReaderResult<T extends string | ArrayBuffer>(
  reader: FileReader
): Promise<T> {
  return new Promise((resolve, reject) => {
    const listener = async function (event: ProgressEvent) {
      reader.removeEventListener('loadend', listener)

      const { error, result } = reader

      if (error) {
        reject(error.message)
      } else {
        resolve((await result) as T)
      }
    }

    reader.addEventListener('loadend', listener)
  })
}

export function readBlobAsDataUrl(system: System, blob: Blob): Promise<string> {
  const {
    api: {
      file: { FileReader },
    },
  } = system

  const reader = new FileReader()

  reader.readAsDataURL(blob)

  return waitFileReaderResult(reader)
}

export function readBlobAsDataUrl_(
  reader: FileReader,
  blob: Blob | File
): Promise<string> {
  reader.readAsDataURL(blob)

  return waitFileReaderResult(reader)
}

export function readBlobAsArrayBuffer_(
  reader: FileReader,
  blob: Blob | File
): Promise<ArrayBuffer> {
  reader.readAsArrayBuffer(blob)

  return waitFileReaderResult(reader)
}

export function readBlobAsText_(
  reader: FileReader,
  blob: Blob | File
): Promise<string> {
  reader.readAsText(blob)

  return waitFileReaderResult(reader)
}

export function wrapFileReader(reader: FileReader, system: System): FR & $ {
  const reader_ = new (class FileReader_ extends $ implements FR {
    __: string[] = ['FR']

    readAsText(blob: File | Blob): Promise<string> {
      return readBlobAsText_(reader, blob)
    }

    readAsDataUrl(blob: Blob): Promise<string> {
      return readBlobAsDataUrl_(reader, blob)
    }

    readAsArrayBuffer(blob: File | Blob): Promise<ArrayBuffer> {
      return readBlobAsArrayBuffer_(reader, blob)
    }
  })(system)

  return reader_
}
