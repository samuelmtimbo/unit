export type Tree<T> = {
  value: T
  children: Tree<T>[]
}

export function traverseTree<T>(
  root: Tree<T>,
  parent: Tree<T>,
  callback: (node: Tree<T>, parent: Tree<T>, path: number[]) => void,
  path: number[] = []
): void {
  callback(root, parent, path)

  root.children.forEach((child: Tree<T>, index: number) =>
    traverseTree(child, root, callback, [...path, index])
  )
}

function _printTree<T>(tree: Tree<T>): void {
  traverseTree(tree, null, (node: Tree<T>, parent, path: number[]) =>
    // eslint-disable-next-line no-console
    console.log(path, parent, node.value)
  )
}
