import { treeComplexityById } from '../spec/complexity'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { getSpec } from './spec'

export const UNIT_MIN_RADIUS: number = 14

const _specComplexityCache: Dict<number> = {}

export const getSpecComplexity = (
  specs: Specs,
  id: string,
  useCache: boolean = true
): number => {
  let c: number
  if (useCache) {
    if (!_specComplexityCache[id]) {
      c = getSpecComplexity(specs, id, false)
    }
    c = _specComplexityCache[id]
  } else {
    c = _treeComplexityByPath(specs, id)
  }
  _specComplexityCache[id] = c
  return c
}

export const getSpecRadius = (
  specs: Specs,
  id: string,
  useCache: boolean = true
): number => {
  const c: number = getSpecComplexity(specs, id, useCache)
  const R = UNIT_MIN_RADIUS + Math.log2(c) / 3
  const _R = Math.round(R) // important to return an integer
  return _R
}

export const _treeComplexityByPath = (specs: Specs, path: string): number => {
  const spec = getSpec(specs, path)
  let c = spec.metadata && spec.metadata.complexity
  if (c === undefined) {
    c = treeComplexityById(specs, path)
  }
  return c
}
