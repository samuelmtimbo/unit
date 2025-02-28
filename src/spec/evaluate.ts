import { Classes, Specs } from '../types'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { fromUnitBundle } from './fromUnitBundle'
import { TreeNode, TreeNodeType, _isValidObjKeyType, getTree } from './parser'

export function _evaluate(
  tree: TreeNode,
  specs: Specs,
  classes: Classes,
  resolver: (url: string) => any = () => {
    return undefined
  }
): any {
  const { value, children } = tree

  switch (tree.type) {
    case TreeNodeType.Identifier:
      return value
    case TreeNodeType.Null:
      return null
    case TreeNodeType.StringLiteral:
      return value
        .substring(1, value.length - 1)
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
    case TreeNodeType.BooleanLiteral:
      return value === 'true' ? true : false
    case TreeNodeType.NumberLiteral:
      return Number.parseFloat(value)
    case TreeNodeType.ArrayLiteral: {
      const array: any[] = []
      for (const element of children) {
        if (element.type !== TreeNodeType.Invalid) {
          array.push(_evaluate(element, specs, classes, resolver))
        }
      }
      return array
    }
    case TreeNodeType.ObjectLiteral: {
      const object = {}
      for (const entry of children) {
        if (entry.type === TreeNodeType.KeyValue) {
          const [key, value] = entry.children
          object[_evaluate(key, specs, classes)] = _evaluate(
            (value.value && value) || key,
            specs,
            classes,
            resolver
          )
        } else if (_isValidObjKeyType(entry)) {
          object[entry.value] = entry.value
        }
      }
      return object
    }
    case TreeNodeType.Unit: {
      const str = value.substring(1)

      const bundle = evaluate(str, specs, classes) as UnitBundleSpec

      return fromUnitBundle(bundle, specs, classes)
    }
    case TreeNodeType.Url: {
      return resolver(value)
    }
    default:
      throw new Error('invalid data string')
  }
}

export function evaluate(
  value: string,
  specs: Specs,
  classes: Classes,
  resolver: (url: string) => any = () => {
    return undefined
  }
): any {
  const tree = getTree(value, false, false)

  return _evaluate(tree, specs, classes, resolver)
}
