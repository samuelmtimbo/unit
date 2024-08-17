import { API } from '../../../../API'
import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { BootOpt } from '../../../../system'

export function webClipboard(window: Window, opt: BootOpt): API['clipboard'] {
  const { navigator } = window

  const read = async () => {
    if (navigator.clipboard && navigator.clipboard.read) {
      const data = await navigator.clipboard.read()

      return data
    }

    throw new APINotSupportedError('Clipboar Read')
  }

  const readText = async () => {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText()
      
      return text
    }

    throw new APINotSupportedError('Clipboar Read Text')
  }

  const writeText = async (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      throw new APINotSupportedError('Clipboard Write Text')
    }
  }

  const clipboard = {
    read,
    readText,
    writeText,
  }

  return clipboard
}
