import { Dict } from '../../../../types/Dict'
import { entries } from '../../../../util/object'

export default function entries_({ obj }: { obj: Dict<any> }): {
  entries: [string, any][]
} {
  return { entries: entries(obj) }
}
