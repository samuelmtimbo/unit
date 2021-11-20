import { uuid } from '../../../util/id'

export function uuidNotInLocalStorage(prefix: string): [string, string] {
  let id: string
  let _id: string
  do {
    id = uuid()
    _id = `${prefix}/${id}`
  } while (localStorage.getItem(_id) !== null)
  return [id, _id]
}
