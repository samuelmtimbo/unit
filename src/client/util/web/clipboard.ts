import { Callback } from '../../../types/Callback'

export function textToClipboard(text: string, callback: Callback<string>) {
  // console.log('textToClipboard', text)
  if (navigator.clipboard) {
    window.navigator.clipboard
      .writeText(text)
      .then(() => {
        callback()
      })
      .catch((err) => {
        callback(err.message)
      })
  } else {
    callback(undefined, 'Clipboard API not supported')
  }
}

export const jsonToClipboard = (
  data: any,
  callback: Callback<undefined>
): void => {
  const text = JSON.stringify(data)
  textToClipboard(text, callback)
}
