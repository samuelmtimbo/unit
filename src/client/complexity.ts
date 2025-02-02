import { treeComplexityById } from '../spec/complexity'
import { getSpec } from '../spec/util'
import { Classes, Specs } from '../types'
import { Dict } from '../types/Dict'

export const UNIT_MIN_RADIUS: number = 14

const _specComplexityCache: Dict<number> = {}

export const getSpecComplexity = (
  specs: Specs,
  classes: Classes,
  id: string,
  useCache: boolean = true
): number => {
  let c: number
  if (useCache) {
    if (!_specComplexityCache[id]) {
      c = getSpecComplexity(specs, classes, id, false)
    }
    c = _specComplexityCache[id]
  } else {
    c = _treeComplexityByPath(specs, classes, id)
  }
  _specComplexityCache[id] = c
  return c
}

export const getSpecRadius = (
  specs: Specs,
  classes: Classes,
  id: string,
  useCache: boolean = true
): number => {
  const c: number = getSpecComplexity(specs, classes, id, useCache)
  const R = UNIT_MIN_RADIUS + Math.log2(c) / 3
  const _R = Math.round(R) // important to return an integer
  return _R
}

export const _treeComplexityByPath = (
  specs: Specs,
  classes: Classes,
  path: string
): number => {
  const spec = getSpec(specs, path)
  let c = spec.metadata && spec.metadata.complexity
  if (c === undefined) {
    c = treeComplexityById(specs, classes, path)
  }
  return c
}
