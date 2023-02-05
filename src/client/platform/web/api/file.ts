import { API } from '../../../../API'
import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { BootOpt } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { IDownloadDataOpt } from '../../../../types/global/IDownloadData'
import { IDownloadURLOpt } from '../../../../types/global/IDownloadURL'

export function webFile(window: Window, opt: BootOpt): API['file'] {
  const { document } = window

  const isSaveFilePickerSupported = () => {
    // @ts-ignore
    return !!window.showSaveFilePicker
  }

  const isOpenFilePickerSupported = () => {
    // @ts-ignore
    return !!window.showOpenFilePicker
  }

  function showSaveFilePicker(opt: {
    suggestedName?: string
    startIn?: string
    id?: string
    excludeAcceptAllOption?: boolean
    types?: {
      description: string
      accept: Dict<string[]>
    }[]
  }): Promise<FileSystemFileHandle> {
    if (isSaveFilePickerSupported()) {
      // @ts-ignore
      return window.showSaveFilePicker(opt)
    } else {
      throw new APINotSupportedError('File System')
    }
  }

  function showOpenFilePicker(opt: {
    suggestedName?: string
    startIn?: string
    id?: string
    excludeAcceptAllOption?: boolean
    types?: {
      description: string
      accept: Dict<string[]>
    }[]
    multiple?: boolean
  }): Promise<FileSystemFileHandle[]> {
    if (isOpenFilePickerSupported()) {
      // @ts-ignore
      return window.showOpenFilePicker(opt)
    } else {
      throw new APINotSupportedError('File System')
    }
  }

  const downloadText = async ({
    name,
    mimetype: mimeType,
    charset,
    text,
  }: IDownloadDataOpt) => {
    const url = `data:${mimeType};charset=${charset},${encodeURIComponent(
      text
    )}`

    return downloadURL({ name, url })
  }

  const testGet = async (url: string): Promise<boolean> => {
    try {
      await fetch(url)

      return true
    } catch (err) {
      console.log(err)

      return false
    }
  }

  const downloadURL = async ({ name, url }: IDownloadURLOpt) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const accessible = await testGet(url)

      if (!accessible) {
        throw new Error('URL is not accessible due to CORS policy')
      }
    }

    const a = document.createElement('a')

    document.body.appendChild(a)

    a.download = name
    a.href = url

    a.click()

    document.body.removeChild(a)
  }

  const file: API['file'] = {
    showSaveFilePicker,
    isSaveFilePickerSupported,
    isOpenFilePickerSupported,
    showOpenFilePicker,
    downloadURL,
    downloadText,
  }

  return file
}
