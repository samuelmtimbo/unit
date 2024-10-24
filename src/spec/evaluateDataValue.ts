import { Unit } from '../Class/Unit'
import { DataRef } from '../DataRef'
import { Classes, Specs } from '../types'
import { _evaluate } from './evaluate'
import { findAndReplaceUnitNodes_, getTree } from './parser'
import { isPrimitive } from './primitive'

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

export function evaluateData(
  data: any,
  specs: Specs,
  classes: Classes,
  path: string[] = []
): DataRef<any> {
  let ref = []

  if (isPrimitive(data)) {
    //
  } else if (
    data.constructor.name === 'Array' ||
    data.constructor.name === 'Object'
  ) {
    const data_ = Array.isArray(data) ? [] : {}

    let ref_: string[]

    for (const k in data) {
      const dataRef_ = evaluateData(data, specs, classes, [...path, k])

      ref = ref.concat([path, ...dataRef_.ref])
      data_[k] = dataRef_.data

      ref.push(ref_)
    }

    data = data_
  } else if (data instanceof Unit) {
    ref.push([])

    // @ts-ignore
    data = data.constructor.__bundle

    delete data.unit.memory
  }

  return {
    ref,
    data,
  }
}
