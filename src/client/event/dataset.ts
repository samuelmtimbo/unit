import { Dict } from '../../types/Dict'
import { mapObjVK } from '../../util/object'

export function eventData(event: Event): Dict<string> {
  const data =
    (event.target &&
      // @ts-ignore
      mapObjVK<string, string>(event.target.dataset || {}, (v) => v)) ||
    {}
  return data
}
