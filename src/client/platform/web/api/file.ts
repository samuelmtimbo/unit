import { API } from '../../../../API'
import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { BootOpt, IFilePickerOpt } from '../../../../system'
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

  function showSaveFilePicker(
    opt: IFilePickerOpt
  ): Promise<FileSystemFileHandle> {
    if (isSaveFilePickerSupported()) {
      // @ts-ignore
      return window.showSaveFilePicker(opt)
    } else {
      throw new APINotSupportedError('File System')
    }
  }

  function showOpenFilePicker(
    opt: IFilePickerOpt
  ): Promise<FileSystemFileHandle[]> {
    if (isOpenFilePickerSupported()) {
      // @ts-ignore
      return window.showOpenFilePicker(opt)
    } else {
      throw new APINotSupportedError('File System')
    }
  }

  function fallbackShowOpenFilePicker(opt: IFilePickerOpt): Promise<File[]> {
    return new Promise((resolve, reject) => {
      const input = window.document.createElement('input')

      input.type = 'file'
      input.hidden = true
      input.multiple = opt.multiple || false
      input.accept = opt.accept ?? '*/*'

      window.document.body.appendChild(input)

      input.onchange = async () => {
        const files = input.files

        if (!files) {
          reject(new Error('No files selected'))

          return
        }

        const final_files: File[] = []

        for (let i = 0; i < files.length; i++) {
          const file = files.item(i)

          final_files.push(file)
        }

        resolve(final_files)
      }

      input.click()

      window.document.body.removeChild(input)
    })
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
      // console.log(err)

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
    fallbackShowOpenFilePicker,
    downloadURL,
    downloadText,
  }

  return file
}
