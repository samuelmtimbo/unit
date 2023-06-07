import { getTree, TreeNode, _isTypeMatch } from '../spec/parser'
import { System } from '../system'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { IO } from '../types/IO'

const _typeMatchCache: Dict<boolean> = {}

const __isTypeMatch = (specs: Specs, a: TreeNode, b: TreeNode): boolean => {
  const cacheKey = `${a.value}/${b.value}`
  if (_typeMatchCache[cacheKey]) {
    return _typeMatchCache[cacheKey]
  } else {
    const typeMatch = _isTypeMatch(specs, a, b)
    _typeMatchCache[cacheKey] = typeMatch
    return typeMatch
  }
}

export const _pinTypeMatch = (
  specs: Specs,
  aType: TreeNode,
  aKind: IO,
  bType: TreeNode,
  bKind: IO
): boolean => {
  if (aKind === 'input' && bKind === 'input') {
    return (
      __isTypeMatch(specs, aType, bType) || __isTypeMatch(specs, bType, aType)
    )
  } else if (aKind === 'input' && bKind === 'output') {
    return __isTypeMatch(specs, bType, aType)
  } else if (aKind === 'output' && bKind === 'input') {
    return __isTypeMatch(specs, aType, bType)
  } else {
    return true
  }
}
