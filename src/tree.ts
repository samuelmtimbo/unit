export type Tree<T> = {
  value: T
  children: Tree<T>[]
}

export function traverseTree<T>(
  root: Tree<T>,
  callback: (node: Tree<T>, path: number[]) => void,
  path: number[] = []
): void {
  callback(root, path)

  root.children.forEach((child: Tree<T>, index: number) =>
    traverseTree(child, callback, [...path, index])
  )
}

function _printTree<T>(tree: Tree<T>): void {
  traverseTree(tree, (node: Tree<T>, path: number[]) =>
    // eslint-disable-next-line no-console
    console.log(path, node.value)
  )
}
