import { Specs } from '../types'
import { fromId } from './fromId'
import { getTree, TreeNode, TreeNodeType, _isValidObjKey } from './parser'

export function _evaluate(tree: TreeNode, specs: Specs = {}): any {
  const { value, children } = tree
  switch (tree.type) {
    case TreeNodeType.Identifier:
      return value
    case TreeNodeType.Null:
      return null
    case TreeNodeType.StringLiteral:
      return value
        .substring(1, value.length - 1)
        .replace(/\\\'/g, "'")
        .replace(/\\n/g, '\\n')
        .replace(/\\r/g, '\\r')
        .replace(/\\\\/g, '\\')
    case TreeNodeType.BooleanLiteral:
      return value === 'true' ? true : false
    case TreeNodeType.NumberLiteral:
      return Number.parseFloat(value)
    case TreeNodeType.ArrayLiteral:
      const array: any[] = []
      for (const element of children) {
        if (element.type !== TreeNodeType.Invalid) {
          array.push(_evaluate(element))
        }
      }
      return array
    case TreeNodeType.ObjectLiteral:
      const object = {}
      for (const entry of children) {
        if (entry.type === TreeNodeType.KeyValue) {
          const [key, value] = entry.children
          object[_evaluate(key)] = _evaluate(value)
        } else if (_isValidObjKey(entry)) {
          object[entry.value] = entry.value
        }
      }
      return object
    case TreeNodeType.Unit:
      return fromId(value, specs)
    default:
      throw new Error('invalid data string')
  }
}

export function evaluate(value: string, specs: Specs = {}): any {
  const tree = getTree(value, false, false)
  return _evaluate(tree, specs)
}
