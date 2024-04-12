import { DataRef } from '../DataRef'
import { Classes, Specs } from '../types'
import { _evaluate } from './evaluate'
import { findAndReplaceUnitNodes_, getTree } from './parser'

export function evaluateDataValue(
  value: string | DataRef,
  specs: Specs,
  classes: Classes
): DataRef<any> {
  const t = typeof value

  let ref = []
  let data: any

  if (t === 'string') {
    const tree = getTree(value as string, false, false)

    const [ref, replacedTree] = findAndReplaceUnitNodes_(tree)

    data = _evaluate(replacedTree, specs, classes)

    return { ref, data }
  } else if (t === 'object') {
    return value as DataRef
  }

  return { ref, data }
}
