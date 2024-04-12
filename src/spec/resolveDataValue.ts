import { DataRef } from '../DataRef'
import deepGet from '../deepGet'
import { deepSet_ } from '../deepSet'
import { Classes, Specs } from '../types'
import { fromUnitBundle } from './fromUnitBundle'

export function resolveDataRef(
  dataRef: DataRef,
  specs: Specs,
  classes: Classes
): any {
  for (const path of dataRef.ref ?? []) {
    const bundle = deepGet(dataRef.data, path)

    const Class = fromUnitBundle(bundle, specs, classes)

    if (path.length === 0) {
      return Class
    } else {
      deepSet_(dataRef.data, path, Class)
    }
  }

  return dataRef.data
}
