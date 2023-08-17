import { Spec, Specs } from '..'
import { randomInArray } from '../../client/id/randomInArray'
import {
  NULL_TREE,
  TreeNode,
  TreeNodeType,
  _applyGenerics,
  _findGenerics,
  getTree,
  isLiteralType,
  isTypeMatch,
} from '../../spec/parser'
import { keys } from '../../system/f/object/Keys/f'
import { rangeArray } from '../../util/array'
import { Dict } from '../Dict'

export function propValue<T>({ value }: { value: T }): T {
  return value
}

export function mapTree(values: string[]): TreeNode[] {
  return values.map((v) => getTree(v))
}

const TREE_VALUE_NUMBER = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const TREE_VALUE_STRING = [`'foo'`, `'bar'`, `'zaz'`]
const TREE_VALUE_BOOLEAN = ['true', 'false']
const TREE_VALUE_OBJECT = ['{}']
const TREE_VALUE_ARRAY = ['[]', '[0]', '[0,1,2]']

const TREE_NUMBER = mapTree(TREE_VALUE_NUMBER)
const TREE_STRING = mapTree(TREE_VALUE_STRING)
const TREE_BOOLEAN = mapTree(TREE_VALUE_BOOLEAN)
const TREE_OBJECT = mapTree(TREE_VALUE_OBJECT)
const TREE_ARRAY = mapTree(TREE_VALUE_ARRAY)

const LITERAL_TREE_NODE_TYPE: TreeNodeType[] = [
  TreeNodeType.Number,
  TreeNodeType.String,
  TreeNodeType.Boolean,
  TreeNodeType.ObjectExpression,
  TreeNodeType.ArrayExpression,
]

export const MAP_TYPE_EXPRESSION_TO_LITERAL = {
  [TreeNodeType.ArrayExpression]: TreeNodeType.ArrayLiteral,
  [TreeNodeType.ObjectExpression]: TreeNodeType.ObjectLiteral,
}

export const randomLiteralType = () => {
  return randomInArray(LITERAL_TREE_NODE_TYPE)
}

export const getTreeNodeTypeName = (tree_node_type: TreeNodeType) => {
  switch (tree_node_type) {
    case TreeNodeType.Number:
      return 'number'
    case TreeNodeType.String:
      return 'string'
    case TreeNodeType.Boolean:
      return 'boolean'
    case TreeNodeType.ObjectExpression:
      return 'string{}' // TODO
    case TreeNodeType.ArrayExpression:
      return 'number[]' // TODO
  }
}

export function randomValueOfObjectLiteral(
  specs: Specs,
  typeTree: TreeNode
): string {
  return propValue(randomTreeOfObjectLiteral(specs, typeTree))
}

export function randomTreeOfObjectLiteral(
  specs: Specs,
  typeTree: TreeNode
): TreeNode {
  const children = []

  for (const type_key_value of typeTree.children) {
    const [type_key_tree, type_value_tree] = type_key_value.children

    const { value: key } = type_key_tree

    let _key: string = key

    let value_tree: TreeNode

    if (key.endsWith('?')) {
      if (Math.random() > 0.5) {
        _key = key.substr(0, key.length - 1)
        value_tree = randomTreeOfType(specs, type_value_tree)
      }
    } else {
      value_tree = randomTreeOfType(specs, type_value_tree)
    }

    if (value_tree) {
      const key_tree = getTree(_key)
      const key_value_tree = {
        value: `${key_tree.value}:${value_tree.value}`,
        children: [key_tree, value_tree],
        type: TreeNodeType.KeyValue,
      }
      children.push(key_value_tree)
    }
  }
  return {
    value: `{${children.map(propValue).join(',')}}`,
    children,
    type: TreeNodeType.ObjectLiteral,
  }
}

export function randomValueOfArrayLiteral(
  specs: Specs,
  tree_type: TreeNode
): string {
  return propValue(randomTreeOfArrayLiteral(specs, tree_type))
}

export function randomTreeOfArrayLiteral(
  specs: Specs,
  tree_type: TreeNode
): TreeNode {
  const children: TreeNode[] = []

  for (const type_child of tree_type.children) {
    const child_tree = randomTreeOfType(specs, type_child)

    children.push(child_tree)
  }

  return {
    value: `[${children.map(propValue).join(',')}]`,
    type: TreeNodeType.ArrayLiteral,
    children,
  }
}

export function randomValueOfTypeExpression(
  specs: Specs,
  typeTree: TreeNode,
  delimiter_open: string,
  delimiter_close: string
) {
  return propValue(
    randomTreeOfTypeExpression(specs, typeTree, delimiter_open, delimiter_close)
  )
}

export function randomTreeOfTypeExpression(
  specs: Specs,
  typeTree: TreeNode,
  delimiter_open: string,
  delimiter_close: string
): TreeNode {
  const { children: type_children, type: type_type } = typeTree

  const type_typeTree = type_children[0]

  const generics = _findGenerics(type_typeTree)

  const generic_type_map: Dict<string> = {}

  if (generics.size > 0) {
    for (const generic of generics) {
      const chosen_tree_type = randomInArray(LITERAL_TREE_NODE_TYPE)
      const chosen_type = getTreeNodeTypeName(chosen_tree_type)

      generic_type_map[generic] = chosen_type
    }
  }

  const literal_typeTree = _applyGenerics(type_typeTree, generic_type_map)

  const size = Math.floor(Math.random() * 3)

  const range = rangeArray(size)

  const children = range.map(() => randomTreeOfType(specs, literal_typeTree))
  const value = `${delimiter_open}${children
    .map(propValue)
    .join(',')}${delimiter_close}`
  const type = MAP_TYPE_EXPRESSION_TO_LITERAL[type_type]

  return {
    value,
    children,
    type,
  }
}

export function randomValueOfOr(specs: Specs, tree: TreeNode): string {
  return randomInArray(tree.children.map((c) => randomValueOfType(specs, c)))
}

export function randomTreeOfOr(specs: Specs, tree: TreeNode): TreeNode {
  const { children } = tree

  const child = randomInArray(children)

  return randomTreeOfType(specs, child)
}

export function randomValueOfAnd(typeTree: TreeNode): string {
  return propValue(randomTreeOfAnd(typeTree))
}

export function randomTreeOfAnd(typeTree: TreeNode): TreeNode {
  // TODO

  return NULL_TREE
}

export function randomValueOfType(specs: Specs, typeTree: TreeNode): string {
  return propValue(randomTreeOfType(specs, typeTree))
}

export function randomTreeOfType(specs: Specs, typeTree: TreeNode): TreeNode {
  const { type } = typeTree

  if (isLiteralType(type)) {
    return typeTree
  }

  if (type === TreeNodeType.Or) {
    return randomTreeOfOr(specs, typeTree)
  } else if (type === TreeNodeType.And) {
    return randomTreeOfAnd(typeTree)
  } else if (type === TreeNodeType.ObjectLiteral) {
    return randomTreeOfObjectLiteral(specs, typeTree)
  } else if (type === TreeNodeType.ArrayLiteral) {
    return randomTreeOfArrayLiteral(specs, typeTree)
  } else if (type === TreeNodeType.ArrayExpression) {
    return randomTreeOfTypeExpression(specs, typeTree, '[', ']')
  } else if (type === TreeNodeType.ObjectExpression) {
    return randomTreeOfTypeExpression(specs, typeTree, '{', '}')
  } else if (type === TreeNodeType.Class) {
    let randomSpecId: string
    let randomSpec: Spec

    do {
      randomSpecId = randomInArray(keys(specs))
      randomSpec = specs[randomSpecId]
    } while (!isTypeMatch(specs, randomSpec.type ?? `G`, typeTree.value))

    return getTree(`\${unit:{id:"${randomSpecId}"}}`)
  } else {
    return randomTreeOfTypeLiteral(specs, type)
  }
}

export function randomTreeOfTypeLiteral(
  specs: Specs,
  type: TreeNodeType
): TreeNode {
  if (type === TreeNodeType.Number) {
    return randomInArray(TREE_NUMBER)
  } else if (type === TreeNodeType.String) {
    return randomInArray(TREE_STRING)
  } else if (type === TreeNodeType.Boolean) {
    return randomInArray(TREE_BOOLEAN)
  } else if (type === TreeNodeType.Object) {
    return randomInArray(TREE_OBJECT)
  } else if (type === TreeNodeType.Generic) {
    return randomTreeOfTypeLiteral(specs, randomLiteralType())
  } else if (type === TreeNodeType.Any) {
    return randomTreeOfTypeLiteral(specs, randomInArray(LITERAL_TREE_NODE_TYPE))
  }
  return NULL_TREE
}

export function randomValueOfTypeLiteral(
  specs: Specs,
  typeTree: TreeNodeType
): string {
  return propValue(randomTreeOfTypeLiteral(specs, typeTree))
}
