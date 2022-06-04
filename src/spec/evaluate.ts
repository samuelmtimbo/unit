import { Classes, Specs } from '../types'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { fromBundle } from './fromBundle'
import { getTree, TreeNode, TreeNodeType, _isValidObjKey } from './parser'

export function _evaluate(tree: TreeNode, specs: Specs, classes: Classes): any {
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
          array.push(_evaluate(element, specs, classes))
        }
      }
      return array
    case TreeNodeType.ObjectLiteral:
      const object = {}
      for (const entry of children) {
        if (entry.type === TreeNodeType.KeyValue) {
          const [key, value] = entry.children
          object[_evaluate(key, specs, classes)] = _evaluate(
            value,
            specs,
            classes
          )
        } else if (_isValidObjKey(entry)) {
          object[entry.value] = entry.value
        }
      }
      return object
    case TreeNodeType.Unit:
      const str = value.substring(1)
      const bundle = evaluate(str, specs, classes) as UnitBundleSpec
      return fromBundle(bundle, specs, classes)
    default:
      throw new Error('invalid data string')
  }
}

export function evaluate(value: string, specs: Specs, classes: Classes): any {
  const tree = getTree(value, false, false)
  return _evaluate(tree, specs, classes)
}
