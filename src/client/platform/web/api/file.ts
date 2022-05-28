import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { API } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { IDownloadDataOpt } from '../../../../types/global/IDownloadData'
import { IDownloadURLOpt } from '../../../../types/global/IDownloadURL'
import { IFileHandler } from '../../../../types/global/IFileHandler'

export function webFile(window: Window, prefix: string): API['file'] {
  const { document } = window

  function showSaveFilePicker(opt: {
    suggestedName?: string
    startIn?: string
    id?: string
    excludeAcceptAllOption?: boolean
    types?: {
      description: string
      accept: Dict<string[]>
    }[]
  }): Promise<IFileHandler[]> {
    // @ts-ignore
    if (window.showSaveFilePicker) {
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
  }): Promise<IFileHandler[]> {
    // @ts-ignore
    if (window.showOpenFilePicker) {
      // @ts-ignore
      return window.showOpenFilePicker(opt)
    } else {
      throw new APINotSupportedError('File System')
    }
  }

  const downloadData = async ({
    name,
    mimeType,
    charset,
    data,
  }: IDownloadDataOpt) => {
    const url = `data:${mimeType};charset=${charset},${encodeURIComponent(
      data
    )}`

    return downloadURL({ name, url })
  }

  const downloadURL = async ({ name, url }: IDownloadURLOpt) => {
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.download = name
    a.href = url
    a.click()
    document.body.removeChild(a)
  }

  const file: API['file'] = {
    showSaveFilePicker,
    showOpenFilePicker,
    downloadURL,
    downloadData,
  }

  return file
}
