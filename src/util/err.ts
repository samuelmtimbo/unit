import { Callback } from '../types/Callback'

export function tryCatch(f: () => Promise<any>, callback: Callback<any>) {
  f()
    .then(callback)
    .catch((err) => {
      callback(undefined, err)
    })
}
