import { Callback } from '../../../Callback'

// DEPRECATED

// export default function textToClipboard(
//   text: string,
//   callback: Callback<undefined>
// ) {
//   const el = document.createElement('textarea')
//   el.value = text
//   document.body.appendChild(el)
//   el.select()
//   document.execCommand('copy')
//   document.body.removeChild(el)
//   callback()
// }

export function textToClipboard(text: string, callback: Callback<string>) {
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
