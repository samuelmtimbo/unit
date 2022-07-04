import { getTree, TreeNode, _isTypeMatch } from '../spec/parser'
import { Specs } from '../types'
import { Dict } from '../types/Dict'
import { IO } from '../types/IO'

const _typeMatchCache: Dict<boolean> = {}

const __isTypeMatch = (a: TreeNode, b: TreeNode, specs: Specs): boolean => {
  const cacheKey = `${a.value}/${b.value}`
  if (_typeMatchCache[cacheKey]) {
    return _typeMatchCache[cacheKey]
  } else {
    const typeMatch = _isTypeMatch(a, b, specs)
    _typeMatchCache[cacheKey] = typeMatch
    return typeMatch
  }
}

export const pinTypeMatch = (
  aTypeStr: string,
  aKind: IO,
  bTypeStr: string,
  bKind: IO,
  specs: Specs
): boolean => {
  const aType = getTree(aTypeStr)
  const bType = getTree(bTypeStr)
  return _pinTypeMatch(aType, aKind, bType, bKind, specs)
}

export const _pinTypeMatch = (
  aType: TreeNode,
  aKind: IO,
  bType: TreeNode,
  bKind: IO,
  specs: Specs
): boolean => {
  if (aKind === 'input' && bKind === 'input') {
    return (
      __isTypeMatch(aType, bType, specs) || __isTypeMatch(bType, aType, specs)
    )
  } else if (aKind === 'input' && bKind === 'output') {
    return __isTypeMatch(bType, aType, specs)
  } else if (aKind === 'output' && bKind === 'input') {
    return __isTypeMatch(aType, bType, specs)
  } else {
    return true
  }
}
