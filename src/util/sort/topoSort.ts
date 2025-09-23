import { Dict } from '../../types/Dict'

export type TopoNode = {
  id: string
  parentId: string | null
  position: number
}

export function topoSort(nodes: TopoNode[]): TopoNode[] {
  const childrenMap: Dict<TopoNode[]> = {}
  const indegree: Dict<number> = {}

  childrenMap[''] = []

  for (const node of nodes) {
    indegree[node.id] = 0
    childrenMap[node.id] = []
  }

  for (const node of nodes) {
    if (node.parentId) {
      childrenMap[node.parentId] = childrenMap[node.parentId] ?? []
      childrenMap[node.parentId].push(node)

      indegree[node.id] = indegree[node.id] + 1
    } else {
      childrenMap[''].push(node)
    }
  }

  for (const [id, children] of Object.entries(childrenMap)) {
    children.sort((a, b) => a.position - b.position)
  }

  const queue = []

  for (const node of childrenMap['']) {
    queue.push(nodes.find((n) => n.id === node.id))
  }

  const result = []

  while (queue.length > 0) {
    const node = queue.shift()

    result.push(node)

    for (const child of childrenMap[node.id]) {
      indegree[child.id] = indegree[child.id] - 1

      if (indegree[child.id] === 0) {
        queue.push(child)
      }
    }
  }

  return result
}
