export type Tree<T> = {
  value: T
  parent: Tree<T> | null
  children: Tree<T>[]
}
