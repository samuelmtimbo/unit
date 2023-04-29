import { getTree, TreeNode, _isTypeMatch } from '../spec/parser'
import { System } from '../system'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { IO } from '../types/IO'

const _typeMatchCache: Dict<boolean> = {}

const __isTypeMatch = (system: System, a: TreeNode, b: TreeNode): boolean => {
  const cacheKey = `${a.value}/${b.value}`
  if (_typeMatchCache[cacheKey]) {
    return _typeMatchCache[cacheKey]
  } else {
    const typeMatch = _isTypeMatch(system, a, b)
    _typeMatchCache[cacheKey] = typeMatch
    return typeMatch
  }
}

export const pinTypeMatch = (
  system: System,
  aTypeStr: string,
  aKind: IO,
  bTypeStr: string,
  bKind: IO,
  specs: Specs
): boolean => {
  const aType = getTree(aTypeStr)
  const bType = getTree(bTypeStr)
  return _pinTypeMatch(system, aType, aKind, bType, bKind, specs)
}

export const _pinTypeMatch = (
  system: System,
  aType: TreeNode,
  aKind: IO,
  bType: TreeNode,
  bKind: IO,
  specs: Specs
): boolean => {
  if (aKind === 'input' && bKind === 'input') {
    return (
      __isTypeMatch(system, aType, bType) || __isTypeMatch(system, bType, aType)
    )
  } else if (aKind === 'input' && bKind === 'output') {
    return __isTypeMatch(system, bType, aType)
  } else if (aKind === 'output' && bKind === 'input') {
    return __isTypeMatch(system, aType, bType)
  } else {
    return true
  }
}
