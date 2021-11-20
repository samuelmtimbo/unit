import { treeComplexityById } from '../spec/complexity'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { getSpec } from './spec'

export const UNIT_MIN_RADIUS: number = 14

const _specComplexityCache: Dict<number> = {}

export const getSpecComplexity = (
  specs: Specs,
  path: string,
  useCache: boolean = true
): number => {
  let c: number
  if (useCache) {
    if (!_specComplexityCache[path]) {
      c = getSpecComplexity(specs, path, false)
    }
    c = _specComplexityCache[path]
  } else {
    c = _treeComplexityByPath(specs, path)
  }
  _specComplexityCache[path] = c
  return c
}

export const getSpecRadius = (
  specs: Specs,
  path: string,
  useCache: boolean = true
): number => {
  const c: number = getSpecComplexity(specs, path, useCache)
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
