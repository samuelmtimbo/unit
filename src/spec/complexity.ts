import { GraphSpec, Spec } from '../types'

// Human Information Retrieval Cost

const HIRC = 1

// tree complexity

export function treeComplexityById(
  id: string,
  known: { [path: string]: boolean } = {}
): number {
  if (known[id]) {
    return HIRC
  }
  known[id] = true
  const spec = globalThis.__specs[id]
  return treeComplexity(spec, known)
}

export function treeComplexity(
  spec: Spec,
  known: { [path: string]: boolean } = {}
): number {
  let c = 0
  const { base } = spec
  if (base) {
    const { metadata = {} } = spec
    const { complexity = 1 } = metadata
    return complexity
  } else {
    c += 2 // Graph Fundamental Complexity
    const { units = {} } = spec as GraphSpec
    for (const unitId in units) {
      const { path } = units[unitId]
      c += treeComplexityById(path, known)
    }
  }
  return c
}

// layer complexity

export function graphComplexityById(path: string): number {
  const graph = globalThis.__specs[path]
  return graphComplexity(graph)
}

export function graphComplexity(graph: GraphSpec): number {
  let c = specComplexity(graph)

  c += graphMergeComplexity(graph)

  c += graphUnitComplexity(graph)

  return c
}

export function graphMergeComplexity(graph: GraphSpec): number {
  const { merges = {} } = graph
  return Object.keys(merges).length
}

export function graphUnitComplexity(graph: GraphSpec): number {
  const known: { [path: string]: true } = {}

  const { units = {} } = graph

  let c: number = 0

  for (const unitId in units) {
    const { path } = units[unitId]
    // if you already know a unit, just grab on memory
    if (!known[path]) {
      const spec = globalThis.__specs[path]
      c += specComplexity(spec)
      known[path] = true
    } else {
      c += HIRC
    }
  }

  return c
}

// interface complexity

export function specComplexityById(id: string): number {
  const spec = globalThis.__specs[id]
  return specComplexity(spec)
}

export function specComplexity(spec: Spec): number {
  return (
    HIRC +
    Object.keys(spec.inputs || {}).length +
    Object.keys(spec.outputs || {}).length
  )
}
