import { Object_ } from './Object'

export async function mirror<T = any>(a: Object_<T>, b: Object_<T>) {
  a.subscribe([], '*', async (type, path, key, data) => {
    const specId = path[0] ?? key

    if (!(await b.hasKey(specId))) {
      b.dispatch(type, path, key, data)
    }
  })
}
