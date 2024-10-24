import { DataRef } from '../DataRef'
import deepSet from '../deepSet'
import { Classes, Specs } from '../types'
import { clone } from '../util/clone'
import { deepGet } from '../util/object'
import { fromUnitBundle } from './fromUnitBundle'
import { stringify } from './stringify'

export function stringifyDataValue(
  value: string | DataRef,
  specs: Specs,
  classes: Classes
): string {
  const t = typeof value

  if (t === 'string') {
    return value as string
  } else if (t === 'object' && t !== null) {
    value = clone(value) as DataRef

    if (value.ref.length === 0) {
      return stringify(value.data)
    } else {
      for (const path of value.ref) {
        const bundle = deepGet(value.data, path)

        value.data = deepSet(
          value.data,
          path,
          stringify(fromUnitBundle(bundle, specs, classes))
        )
      }

      return value.data
    }
  }
}
