import { DataRef } from '../DataRef'
import { deepSet_ } from '../deepSet'
import { Classes, Specs } from '../types'
import { deepGet } from '../util/object'
import { weakMerge } from '../weakMerge'
import { fromUnitBundle } from './fromUnitBundle'

export function resolveDataRef(
  dataRef: DataRef,
  specs: Specs,
  classes: Classes
): any {
  for (const path of dataRef.ref ?? []) {
    const bundle = deepGet(dataRef.data, path)

    const Class = fromUnitBundle(
      bundle,
      weakMerge(specs, bundle.specs ?? {}),
      classes
    )

    if (path.length === 0) {
      return Class
    } else {
      deepSet_(dataRef.data, path, Class)
    }
  }

  return dataRef.data
}
