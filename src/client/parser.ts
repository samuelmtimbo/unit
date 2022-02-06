import { getTree, TreeNode, _isTypeMatch } from '../spec/parser'
import { Dict } from '../types/Dict'
import { IO } from '../types/IO'

const _typeMatchCache: Dict<boolean> = {}

const __isTypeMatch = (a: TreeNode, b: TreeNode): boolean => {
  const cacheKey = `${a.value}/${b.value}`
  if (_typeMatchCache[cacheKey]) {
    return _typeMatchCache[cacheKey]
  } else {
    const typeMatch = _isTypeMatch(a, b)
    _typeMatchCache[cacheKey] = typeMatch
    return typeMatch
  }
}

export const pinTypeMatch = (
  aTypeStr: string,
  aKind: IO,
  bTypeStr: string,
  bKind: IO
): boolean => {
  const aType = getTree(aTypeStr)
  const bType = getTree(bTypeStr)
  return _pinTypeMatch(aType, aKind, bType, bKind)
}

export const _pinTypeMatch = (
  aType: TreeNode,
  aKind: IO,
  bType: TreeNode,
  bKind: IO
): boolean => {
  if (aKind === 'input' && bKind === 'input') {
    return __isTypeMatch(aType, bType) || __isTypeMatch(bType, aType)
  } else if (aKind === 'input' && bKind === 'output') {
    return __isTypeMatch(bType, aType)
  } else if (aKind === 'output' && bKind === 'input') {
    return __isTypeMatch(aType, bType)
  } else {
    return true
  }
}

// assert(pinTypeMatch('number', 'input', 'number', 'input'))
// assert(pinTypeMatch('1', 'input', 'number', 'input'))
// assert(pinTypeMatch('any', 'input', 'number', 'output'))
// assert(pinTypeMatch('any', 'output', 'number', 'output'))

// assert(!pinTypeMatch('number', 'input', 'string', 'input'))
// assert(!pinTypeMatch('1', 'input', 'any', 'output'))
