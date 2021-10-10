import { Dict } from '../../types/Dict'
import { mapObj } from '../../util/object'

export function eventData(event: Event): Dict<string> {
  const data =
    (event.target &&
      // @ts-ignore
      mapObj<string, string>(event.target.dataset || {}, (v) => v)) ||
    {}
  return data
}
