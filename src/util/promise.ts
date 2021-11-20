import { Dict } from '../types/Dict'

export async function objPromise<T>(obj: Dict<Promise<T>>): Promise<Dict<T>> {
  const _obj = {}
  for (const key in obj) {
    const p = obj[key]
    _obj[key] = await p
  }
  return _obj
}

export function promiseSeries(providers: any[]): Promise<any> {
  const _return = Promise.resolve(null)
  const results = []

  return providers
    .reduce(function (result, provider, index) {
      return result.then(function () {
        return provider().then(function (value) {
          results[index] = value
        })
      })
    }, _return)
    .then(function () {
      return results
    })
}
