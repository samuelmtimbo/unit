import { Object_ } from './Object'

export function mirror<T = any>(a: Object_<T>, b: Object_<T>) {
  a.subscribe([], '*', (type, path, key, data) => {
    const specId = path[0] ?? key

    if (b[specId] === undefined) {
      b.dispatch(type, path, key, data)
    }
  })
}
