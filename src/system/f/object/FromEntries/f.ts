import { fromEntries } from '../../../../util/object'

export default function fromEntries_({
  entries,
}: {
  entries: [string, any][]
}): {
  obj: object
} {
  return { obj: fromEntries(entries) }
}
