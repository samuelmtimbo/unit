import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { API, BootOpt } from '../../../../system'

export function webClipboard(window: Window, opt: BootOpt): API['clipboard'] {
  const { navigator } = window

  const readText = async () => {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText()
      return text
    }
  }

  const writeText = async (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      throw new APINotSupportedError('Clipboard')
    }
  }

  const clipboard = {
    readText,
    writeText,
  }

  return clipboard
}
