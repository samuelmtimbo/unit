import { keys } from '../system/f/object/Keys/f'
import { GraphSpec, Spec, Specs } from '../types'

const HIRC = 1 // Human Information Retrieval Cost
const GFC = 2 // Graph Fundamental Complexity

// tree complexity

export function treeComplexityById(
  specs: Specs,
  id: string,
  known: { [path: string]: boolean } = {}
): number {
  if (known[id]) {
    return HIRC
  }

  known[id] = true

  const spec = specs[id]

  return treeComplexity(specs, spec, known)
}

export function treeComplexity(
  specs: Specs,
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
    c += GFC

    const { units = {} } = spec as GraphSpec

    for (const unitId in units) {
      const unit = units[unitId]

      const { id, input = {} } = unit

      for (const inputId in input) {
        const _input = input[inputId]

        if (_input.data !== undefined) {
          const l = _input.data.length
        }
      }

      c += treeComplexityById(specs, id, known)
    }
  }

  return c
}

// layer complexity

export function graphComplexityById(specs: Specs, path: string): number {
  const graph = specs[path] as GraphSpec

  return graphComplexity(specs, graph)
}

export function graphComplexity(specs: Specs, graph: GraphSpec): number {
  let c = specComplexity(graph)

  c += graphMergeComplexity(graph)
  c += graphUnitComplexity(specs, graph)

  return c
}

export function graphMergeComplexity(graph: GraphSpec): number {
  const { merges = {} } = graph

  return keys(merges).length
}

export function graphUnitComplexity(specs: Specs, graph: GraphSpec): number {
  const known: { [path: string]: true } = {}

  const { units = {} } = graph

  let c: number = 0

  for (const unitId in units) {
    const { id } = units[unitId]
    // if you already know a unit, just grab from memory
    if (!known[id]) {
      const spec = specs[id]

      c += specComplexity(spec)

      known[id] = true
    } else {
      c += HIRC
    }
  }

  return c
}

// interface complexity

export function specComplexityById(specs: Specs, id: string): number {
  const spec = specs[id]

  return specComplexity(spec)
}

export function specComplexity(spec: Spec): number {
  return HIRC + keys(spec.inputs || {}).length + keys(spec.outputs || {}).length
}
