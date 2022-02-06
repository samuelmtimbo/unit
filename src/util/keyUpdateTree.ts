import {
  getParentPath,
  getTree,
  isCompositeType,
  TreeNode,
  TreeNodeType,
  _getLastLeaf,
  _getLastLeafPath,
  _getNextLeafPath,
  _getNextNodePath,
  _getNodeAtPath,
  _getParent,
  _insertNodeAt,
  _isValidTree,
  _removeNodeAt,
  _updateNodeAt,
} from '../spec/parser'

export const _keyUpdateTree = (
  root: TreeNode,
  path: number[],
  value: string,
  key: string,
  selectionStart: number,
  selectionEnd: number,
  shiftKey: boolean
): [
  boolean,
  {
    nextRoot: TreeNode
    nextPath: number[]
    nextSelectionStart: number
    nextSelectionEnd: number
    nextDirection?: 'forward' | 'backward' | 'none' | undefined
  }
] => {
  const data = getTree(value)

  const valid = _isValidTree(data)

  let preventDefault: boolean = false

  let nextRoot: TreeNode = root
  let nextPath = path
  let nextSelectionStart = selectionStart
  let nextSelectionEnd = selectionEnd

  let nextDirection: 'forward' | 'backward' | 'none' | undefined = undefined

  if (key === 'Backspace') {
    if (value === '' && path.length > 0) {
      const parentPath = getParentPath(path) as number[]
      const parent = _getNodeAtPath(root, parentPath)!
      if (
        parent.type === TreeNodeType.ArrayLiteral ||
        parent.type === TreeNodeType.ObjectLiteral
      ) {
        if (parent.children.length === 0) {
          // `{|}` + Backspace = ``
          preventDefault = true
          nextRoot = _updateNodeAt(root, parentPath, getTree(''))
          nextPath = parentPath
        } else {
          preventDefault = true
          nextRoot = _removeNodeAt(root, path)
          nextPath = _getNextLeafPath(root, path, -1) || [0]
        }
      } else if (parent.type === TreeNodeType.KeyValue) {
        preventDefault = true
        nextRoot = _removeNodeAt(root, path)
        nextPath = parentPath
      }

      let nextFocusNode = _getNodeAtPath(nextRoot, nextPath)

      if (nextFocusNode) {
        let lastLeafPath = _getLastLeafPath(nextFocusNode)
        let lastLeaf = _getLastLeaf(nextFocusNode)

        preventDefault = true

        if (isCompositeType(lastLeaf.type)) {
          const leafPath = [...nextPath, ...lastLeafPath]

          lastLeaf = _insertNodeAt(lastLeaf, [0], getTree(''))

          nextRoot = _updateNodeAt(nextRoot, leafPath, lastLeaf)
          nextPath = [...leafPath, 0]

          nextSelectionStart = 0
          nextSelectionEnd = 0
        } else {
          nextSelectionStart = lastLeaf.value.length
          nextSelectionEnd = nextSelectionStart
        }
      }
    } else if (
      (value === `""` || value === `''` || value === '``') &&
      selectionStart === 1
    ) {
      preventDefault = true
      nextRoot = _updateNodeAt(root, path, getTree(''))
    } else {
      const parentPath = getParentPath(path) as number[]
      if (parentPath) {
        const parent = _getNodeAtPath(root, parentPath)
        if (parent.type === TreeNodeType.KeyValue) {
          if (path[path.length - 1] === 1) {
            if (selectionStart === 0 && selectionEnd === 0) {
              preventDefault = true
              const key = _getNodeAtPath(parent, [0])
              const nextValue = key.value + value
              nextRoot = _updateNodeAt(root, parentPath, getTree(nextValue))
              nextPath = parentPath
              nextSelectionStart = key.value.length
              nextSelectionEnd = nextSelectionStart
            }
          }
        }
      }
    }
  } else if (key === 'ArrowLeft') {
    if (selectionStart === 0) {
      const parentPath = getParentPath(path) as number[]
      const leftLeafPath =
        _getNextLeafPath(root, path, -1) ||
        (parentPath && _getNextLeafPath(root, parentPath, -1))
      if (leftLeafPath) {
        preventDefault = true
        const leftLeafNode = _getNodeAtPath(nextRoot, leftLeafPath)!
        if (value === '') {
          nextRoot = _removeNodeAt(nextRoot, path)
        }
        nextPath = leftLeafPath
        if (!nextPath || !_getNodeAtPath(nextRoot, nextPath)) {
          const parentPath = getParentPath(path) as number[]
          nextPath = parentPath
        }
        nextSelectionStart = leftLeafNode.value.length
        nextSelectionEnd = nextSelectionStart
      }
    }
  } else if (key === 'ArrowRight') {
    if (selectionStart === value.length) {
      const rightLeafPath = _getNextLeafPath(nextRoot, path, 1)
      if (rightLeafPath) {
        if (value === '') {
          preventDefault = true
          nextRoot = _removeNodeAt(nextRoot, path)
        } else {
          preventDefault = true
          nextPath = rightLeafPath
          if (!nextPath || !_getNodeAtPath(nextRoot, nextPath)) {
            const parentPath = getParentPath(path) as number[]
            nextPath = parentPath
          }
          const nextFocusNode = _getNodeAtPath(nextRoot, nextPath)
          if (
            nextFocusNode &&
            (nextFocusNode.type === TreeNodeType.ArrayLiteral ||
              nextFocusNode.type === TreeNodeType.ObjectLiteral) &&
            nextFocusNode.children.length === 0
          ) {
            preventDefault = true
            nextPath = [...nextPath, 0]
          }
        }
        preventDefault = true
        nextSelectionStart = 0
        nextSelectionEnd = 0
      }
    }
  } else if (key === 'ArrowUp') {
    // TODO
  } else if (key === 'ArrowDown') {
    // TODO
  } else if (key === 'Tab') {
    // TODO
  } else if (key === ',') {
    let parentPath = getParentPath(path)
    if (parentPath) {
      const parent = _getNodeAtPath(root, parentPath)!
      if (
        isCompositeType(parent.type) &&
        (data.type !== TreeNodeType.StringLiteral ||
          selectionStart === value.length)
      ) {
        if (
          parent.type === TreeNodeType.ArrayLiteral ||
          parent.type === TreeNodeType.ObjectLiteral
        ) {
          preventDefault = true
          if (value === '') {
            //
          } else {
            nextPath[nextPath.length - 1] += 1
            nextRoot = _insertNodeAt(root, nextPath, getTree(''))
            nextSelectionStart = 0
            nextSelectionEnd = 0
          }
        } else if (parent.type === TreeNodeType.KeyValue) {
          preventDefault = true
          if (value === '') {
            nextRoot = _removeNodeAt(root, path)
          }
          nextPath = [...parentPath]
          nextPath[nextPath.length - 1] += 1
          nextRoot = _insertNodeAt(nextRoot, nextPath, getTree(''))
          nextSelectionStart = 0
          nextSelectionEnd = 0
        }
      }
    }
  } else if ((key === ']' || key === '}') && (valid || value === '')) {
    let parentPath = getParentPath(path)
    if (parentPath) {
      const parent = _getNodeAtPath(root, parentPath)!
      const grandpaPath = getParentPath(parentPath)
      if (
        (parent.type === TreeNodeType.ArrayLiteral && key === ']') ||
        (parent.type === TreeNodeType.ObjectLiteral && key === '}')
      ) {
        if (value === '') {
          preventDefault = true
          nextRoot = _removeNodeAt(nextRoot, path)
        }
        if (grandpaPath) {
          const grandpa = _getNodeAtPath(nextRoot, grandpaPath)!
          if (
            grandpa.type === TreeNodeType.ArrayLiteral ||
            grandpa.type === TreeNodeType.ObjectLiteral
          ) {
            preventDefault = true
            nextPath = [...parentPath]
            nextPath[nextPath.length - 1] += 1
            nextRoot = _insertNodeAt(nextRoot, nextPath, getTree(''))
            nextSelectionStart = 0
            nextSelectionEnd = 0
          } else if (grandpa.type === TreeNodeType.KeyValue) {
            preventDefault = true
            nextPath = [...grandpaPath]
            nextPath[nextPath.length - 1] += 1
            nextRoot = _insertNodeAt(nextRoot, nextPath, getTree(''))
            nextSelectionStart = 0
            nextSelectionEnd = 0
          }
        }
      } else if (parent.type === TreeNodeType.KeyValue && key === '}') {
        const grangrandpaPath = getParentPath(grandpaPath)
        if (grangrandpaPath) {
          preventDefault = true
          if (value === '') {
            nextRoot = _removeNodeAt(root, path)
          }
          nextPath = [...grandpaPath]
          nextPath[nextPath.length - 1] += 1

          const grangrandpa = _getNodeAtPath(nextRoot, grangrandpaPath)!
          if (
            grangrandpa.type === TreeNodeType.ArrayLiteral ||
            grangrandpa.type === TreeNodeType.ObjectLiteral
          ) {
            preventDefault = true
            nextPath = [...grandpaPath]
            nextPath[nextPath.length - 1] += 1
            nextRoot = _insertNodeAt(nextRoot, nextPath, getTree(''))
            nextSelectionStart = 0
            nextSelectionEnd = 0
          } else if (grangrandpa.type === TreeNodeType.KeyValue) {
            preventDefault = true
            nextPath = [...grangrandpaPath]
            nextPath[nextPath.length - 1] += 1
            nextRoot = _insertNodeAt(nextRoot, nextPath, getTree(''))
            nextSelectionStart = 0
            nextSelectionEnd = 0
          }
        }
      }
    } else {
      if (value === '') {
        preventDefault = true
        nextPath = [...path, 0]
        nextRoot = _updateNodeAt(root, path, getTree(shiftKey ? '{}' : `[]`))
        nextSelectionStart = 1
        nextSelectionEnd = 1
      }
    }
  } else if (key === ':') {
    const parent = _getParent(root, path)
    if (parent && parent.type === TreeNodeType.ObjectLiteral) {
      preventDefault = true
      nextRoot = _updateNodeAt(
        root,
        path,
        getTree(
          `${data.value.substring(0, selectionStart)}:${data.value.substring(
            selectionEnd
          )}`
        )
      )
      nextPath = [...path, 1]
      nextSelectionStart = 0
      nextSelectionEnd = 0
    }
  } else if (key === '[' || key === '{') {
    if (value === '') {
      const parentPath = getParentPath(path)
      const parent = parentPath && _getNodeAtPath(root, parentPath)
      const lastIndex = path[path.length - 1]
      if (
        !parent ||
        ((parent.type !== TreeNodeType.KeyValue ||
          (parent.type === TreeNodeType.KeyValue && lastIndex !== 0)) &&
          (parent.type !== TreeNodeType.ObjectLiteral ||
            (parent.type === TreeNodeType.ObjectLiteral && lastIndex !== 0)))
      ) {
        preventDefault = true
        nextPath = [...path, 0]
        nextRoot = _updateNodeAt(root, path, getTree(key === '{' ? '{}' : `[]`))
        nextSelectionStart = 1
        nextSelectionEnd = 1
      }
    } else if (selectionStart === 0 && selectionEnd === value.length) {
      preventDefault = true
      const nextValue = key === `[` ? `[${value}]` : `{${value}}`
      nextRoot = _updateNodeAt(root, path, getTree(nextValue))
      nextPath = _getNextNodePath(nextRoot, path, 1)
      nextSelectionStart = 1
      nextSelectionEnd = value.length + 1
      nextDirection = 'forward'
    }
  } else if (key === `'` || key === `"`) {
    if (value === '') {
      preventDefault = true
      const nextValue = key === `'` ? `''` : `""`
      nextRoot = _updateNodeAt(root, path, getTree(nextValue))
      nextPath = path
      nextSelectionStart = 1
      nextSelectionEnd = 1
    } else if (selectionStart === 0 && selectionEnd === value.length) {
      preventDefault = true
      const nextValue = key === `'` ? `'${value}'` : `"${value}"`
      nextRoot = _updateNodeAt(root, path, getTree(nextValue))
      nextSelectionStart = 1
      nextSelectionEnd = value.length + 1
      nextDirection = 'forward'
    } else {
      const enclosing = key === `'` ? `'` : `"`
      if (
        value.endsWith(enclosing) &&
        selectionStart === value.length - 1 &&
        value[selectionStart - 1] !== '\\'
      ) {
        preventDefault = true
        nextSelectionStart = value.length
        nextSelectionEnd = nextSelectionStart
      }
    }
  } else if (key === `\``) {
    if (!shiftKey) {
      if (value === '') {
        preventDefault = true
        const nextValue = `\`\``
        nextRoot = _updateNodeAt(root, path, getTree(nextValue))
        nextPath = path
        nextSelectionStart = 1
        nextSelectionEnd = nextSelectionStart
      } else {
        const enclosing = `\``
        if (
          value.endsWith(enclosing) &&
          selectionStart === value.length - 1 &&
          value[selectionStart - 1] !== '\\'
        ) {
          preventDefault = true
          nextSelectionStart = value.length
          nextSelectionEnd = nextSelectionStart
        }
      }
    }
  }

  return [
    preventDefault,
    {
      nextRoot,
      nextPath,
      nextSelectionStart,
      nextSelectionEnd,
      nextDirection,
    },
  ]
}

export const keyUpdateTree = (
  root: string,
  focus: number[],
  value: string,
  key: string,
  selectionStart: number,
  shiftKey: boolean
): [
  boolean,
  { nextRoot: string; nextPath: number[]; nextSelectionStart: number }
] => {
  const _root = getTree(root)
  const [
    preventDefault,
    { nextRoot: _nextRoot, nextPath, nextSelectionStart },
  ] = _keyUpdateTree(
    _root,
    focus,
    value,
    key,
    selectionStart,
    selectionStart,
    shiftKey
  )
  return [
    preventDefault,
    {
      nextRoot: _nextRoot.value,
      nextPath,
      nextSelectionStart,
    },
  ]
}
