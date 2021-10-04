import { randomInArray } from './client/id'
import { evaluate } from './spec/evaluate'
import { TreeNode, TreeNodeType } from './spec/parser'
import { stringify } from './spec/stringify'

const PLACEHOLDER_NUMBER = ['0', '1', '2', '3']
const PLACEHOLDER_STRING = [`'foo'`, `'bar'`, `'zaz'`]
const PLACEHOLDER_BOOLEAN = ['true', 'false']
const PLACEHOLDER_OBJECT = ['{}', '{foo:"bar"}']
const PLACEHOLDER_ARRAY = ['[]', '[0]', '[0,1,2]']
const PLACEHOLDER_ANY = ['[]', '[0]', '[0,1,2]']

const LITERAL_TREE_NODE_TYPE: TreeNodeType[] = [
  TreeNodeType.Number,
  TreeNodeType.String,
  TreeNodeType.Boolean,
  TreeNodeType.ObjectLiteral,
  TreeNodeType.ArrayLiteral,
]

export const randomValueOfType = (tree: TreeNode): string => {
  const { type } = tree

  if (type === TreeNodeType.Or) {
    return randomInArray(tree.children.map((c) => randomValueOfType(c)))
  } else if (type === TreeNodeType.And) {
    // TODO
    return 'null'
  } else if (type === TreeNodeType.ObjectLiteral) {
    const obj = {}
    for (const key_value of tree.children) {
      const [key_tree, value_tree] = key_value.children
      let { value: key } = key_tree
      if (key.endsWith('?')) {
        if (Math.random() > 0.5) {
          key = key.substr(0, key.length - 1)
          obj[key] = evaluate(randomValueOfType(value_tree))
        }
      } else {
        obj[key] = evaluate(randomValueOfType(value_tree))
      }
    }
    return stringify(obj)
  } else if (type === TreeNodeType.ArrayExpression) {
    return '[]'
  } else {
    return _randomValueOfType(type)
  }
}
const _randomValueOfType = (type: TreeNodeType): string => {
  if (type === TreeNodeType.Number) {
    return randomInArray(PLACEHOLDER_NUMBER)
  } else if (type === TreeNodeType.String) {
    return randomInArray(PLACEHOLDER_STRING)
  } else if (type === TreeNodeType.Boolean) {
    return randomInArray(PLACEHOLDER_BOOLEAN)
  } else if (type === TreeNodeType.Object) {
    return randomInArray(PLACEHOLDER_OBJECT)
  } else if (type === TreeNodeType.ArrayExpression) {
    return randomInArray(PLACEHOLDER_ARRAY)
  } else if (type === TreeNodeType.Generic) {
    return _randomValueOfType(randomInArray(LITERAL_TREE_NODE_TYPE))
  } else if (type === TreeNodeType.Class) {
    return randomInArray(Object.keys(globalThis.__specs))
  } else if (type === TreeNodeType.Any) {
    return _randomValueOfType(randomInArray(LITERAL_TREE_NODE_TYPE))
  }
  return 'null'
}
