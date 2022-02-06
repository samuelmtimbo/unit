import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import deepMerge from '../system/f/object/DeepMerge/f'
import { BaseSpec, GraphMergeSpec, GraphSpec, Spec, Specs } from '../types'
import { Dict } from '../types/Dict'
import { IO } from '../types/IO'
import { clone, mapObjVK } from '../util/object'
import {
  applyGenerics,
  extractGenerics,
  findGenerics,
  getTree,
  TreeNode,
  TreeNodeType,
  _applyGenerics,
  _extractGenerics,
  _findGenerics,
  _getValueType,
  _hasGeneric,
} from './parser'
import { findMergePin, forEachPinOnMerge } from './util'

export type TypeInterface = {
  input: Dict<string>
  output: Dict<string>
}

export type TypeTreeInterface = {
  input: Dict<TreeNode>
  output: Dict<TreeNode>
}

export const getSpecTypeInterfaceByPath = (
  path: string,
  specs: Specs,
  cache: { [path: string]: TypeTreeInterface } = {},
  visited: { [path: string]: true } = {}
): TypeInterface => {
  const typeInterface = _getSpecTypeInterfaceByPath(path, specs, cache, visited)
  return typeTreeToType(typeInterface)
}

export const _getSpecTypeInterfaceByPath = (
  path: string,
  specs: Specs,
  cache: { [path: string]: TypeTreeInterface } = {},
  visited: { [path: string]: true } = {}
): TypeTreeInterface => {
  let typeInterface: TypeTreeInterface
  if (cache[path]) {
    typeInterface = cache[path]
  } else {
    const spec = specs[path]
    if (!spec) {
      throw new Error(`Spec not found ${path}`)
    }
    typeInterface = _getSpecTypeInterface(spec, specs, cache, {
      ...visited,
      [path]: true,
    })
    cache[path] = typeInterface
  }
  return typeInterface
}

export const typeTreeToType = (
  typeTreeInterface: TypeTreeInterface
): TypeInterface => {
  const { input, output } = typeTreeInterface
  const typeInterface: TypeInterface = { input: {}, output: {} }
  for (let inputId in input) {
    const inputTree = input[inputId]
    typeInterface.input[inputId] = inputTree.value
  }
  for (let outputId in output) {
    const outputTree = output[outputId]
    typeInterface.output[outputId] = outputTree.value
  }
  return typeInterface
}

export const typeTreeMapToTypeMap = (graphTypeTree: TypeTreeMap): TypeMap => {
  return mapObjVK(graphTypeTree, (typeTree) => {
    return typeTreeToType(typeTree)
  })
}

export const _getSpecTypeInterface = (
  spec: Spec,
  specs: Specs,
  cache: { [path: string]: TypeTreeInterface } = {},
  visited: { [path: string]: true } = {}
): TypeTreeInterface => {
  let typeInterface: TypeTreeInterface
  const base = !!spec.base
  if (base) {
    typeInterface = _getBaseTypeInterface(spec as BaseSpec)
  } else {
    typeInterface = _getGraphTypeInterface(
      spec as GraphSpec,
      specs,
      cache,
      visited
    )
  }
  return typeInterface
}

export const _getBaseTypeInterfaceByPath = (
  path: string,
  specs: Specs
): TypeTreeInterface => {
  const spec = specs[path] as BaseSpec
  return _getBaseTypeInterface(spec)
}

export const _getBaseTypeInterface = (spec: BaseSpec): TypeTreeInterface => {
  const typeInterface: TypeTreeInterface = { input: {}, output: {} }
  forEachKeyValue(spec.inputs, ({ type }, inputId) => {
    typeInterface.input[inputId] = getTree(type)
  })
  forEachKeyValue(spec.outputs, ({ type }, outputId) => {
    typeInterface.output[outputId] = getTree(type)
  })
  return typeInterface
}

export const _getGraphTypeInterfaceByPath = (
  path: string,
  specs: Specs,
  cache: { [path: string]: TypeTreeInterface } = {},
  visited: { [path: string]: true } = {}
): TypeTreeInterface => {
  // console.log('getGraphTypeInterfaceByPath', path)
  const spec = specs[path] as GraphSpec
  return _getGraphTypeInterface(spec, specs, cache, visited)
}

export const getGraphTypeInterface = (
  spec: GraphSpec,
  specs: Specs,
  cache: { [path: string]: TypeTreeInterface } = {},
  visited: { [path: string]: true } = {}
) => {
  const graphTypeTree = _getGraphTypeInterface(spec, specs, cache, visited)
  return typeTreeToType(graphTypeTree)
}

export const _getGraphTypeInterface = (
  spec: GraphSpec,
  specs: Specs,
  cache: { [path: string]: TypeTreeInterface } = {},
  visited: { [path: string]: true } = {}
): TypeTreeInterface => {
  // console.log('_getGraphTypeInterface')
  const typeInterface: TypeTreeInterface = { input: {}, output: {} }
  const unitTypeMap = _getGraphTypeMap(spec, specs, cache, visited)

  const { inputs = {}, outputs = {} } = spec

  forEachKeyValue(inputs, ({ pin, type }, inputId) => {
    let inputType = getTree('any')
    if (type) {
      inputType = getTree(type)
    } else {
      forEachKeyValue(pin, ({ mergeId, unitId, pinId }) => {
        let subPinType
        if (mergeId) {
          const merge = spec.merges[mergeId]
          const mergeInputPin = findMergePin(merge, 'input')
          subPinType =
            unitTypeMap[mergeInputPin.unitId].input[mergeInputPin.pinId]
        } else if (unitId && pinId) {
          subPinType = unitTypeMap[unitId].input[pinId]
        }

        if (subPinType) {
          inputType = _moreSpecific(inputType, subPinType)
        }
      })
    }
    typeInterface.input[inputId] = inputType
  })

  forEachKeyValue(outputs, ({ pin, type }, outputId) => {
    let outputType = getTree('any')
    if (type) {
      outputType = getTree(type)
    } else {
      forEachKeyValue(pin, ({ mergeId, unitId, pinId }) => {
        let subPinType
        if (mergeId) {
          const merge = spec.merges[mergeId]
          let type
          forEachPinOnMerge(merge, (unitId, kind, pinId) => {
            if (kind === 'output') {
              if (!type) {
                type = unitTypeMap[unitId].output[pinId]
              } else {
                type = _lessSpecific(type, unitTypeMap[unitId].output[pinId])
              }
            }
          })
          subPinType = type
        } else if (unitId && pinId) {
          subPinType = unitTypeMap[unitId].output[pinId]
        }
        if (subPinType) {
          outputType = _moreSpecific(outputType, subPinType)
        }
      })
    }
    typeInterface.output[outputId] = outputType
  })

  let i = 65
  const replacement: { [generic: string]: string } = {}
  const { input, output } = typeInterface
  const inputPinIds = Object.keys(input).sort()
  const outputPinIds = Object.keys(output).sort()
  for (const inputPinId of inputPinIds) {
    const type = input[inputPinId]
    const generics = _findGenerics(type)
    for (const generic of generics) {
      if (!replacement[generic]) {
        replacement[generic] = `<${String.fromCharCode(i++)}>`
      }
    }
    input[inputPinId] = _applyGenerics(type, replacement)
  }
  for (const outputPinId of outputPinIds) {
    const type = output[outputPinId]
    const generics = _findGenerics(type)
    for (const generic of generics) {
      if (!replacement[generic]) {
        replacement[generic] = `<${String.fromCharCode(i++)}>`
      }
    }
    output[outputPinId] = _applyGenerics(type, replacement)
  }

  return typeInterface
}

export const createGenericTypeInterface = (
  path: string,
  specs: Specs
): TypeTreeInterface => {
  // console.log('createGenericTypeInterface', path)
  const spec = specs[path]
  const typeInterface: TypeTreeInterface = { input: {}, output: {} }
  let i = 0
  const inputIds = Object.keys(spec.inputs)
  const outputIds = Object.keys(spec.outputs)
  function register(kind: IO, pinId: string): void {
    typeInterface[kind][pinId] = getTree(`<${i}>`)
    i++
  }
  inputIds.forEach((inputId) => register('input', inputId))
  outputIds.forEach((outputId) => register('output', outputId))
  return typeInterface
}

export const isMoreSpecific = (a: string, b: string): boolean => {
  const aTree = getTree(a)
  const bTree = getTree(b)
  return _isMoreSpecific(aTree, bTree)
}

export const _isMoreSpecific = (a: TreeNode, b: TreeNode): boolean => {
  if (a.value === 'any') {
    return false
  } else if (b.value === 'any') {
    return true
  }
  const aGenericCount = _findGenerics(a).size
  const bGenericCount = _findGenerics(b).size
  if (aGenericCount > bGenericCount) {
    return false
  } else if (aGenericCount < bGenericCount) {
    return true
  } else {
    if (a.children.length > b.children.length) {
      return true
    } else if (a.children.length < b.children.length) {
      return false
    } else if (a.value < b.value) {
      return true
    } else {
      return false
    }
  }
}

export const moreSpecific = (a: string, b: string): string => {
  if (isMoreSpecific(a, b)) {
    return a
  } else {
    return b
  }
}

export const _moreSpecific = (a: TreeNode, b: TreeNode): TreeNode => {
  if (_isMoreSpecific(a, b)) {
    return a
  } else {
    return b
  }
}

export const lessSpecific = (a: string, b: string): string => {
  if (isMoreSpecific(a, b)) {
    return b
  } else {
    return a
  }
}

export const _lessSpecific = (a: TreeNode, b: TreeNode): TreeNode => {
  if (_isMoreSpecific(a, b)) {
    return b
  } else {
    return a
  }
}

export type TypeTreeMap = Dict<TypeTreeInterface>
export type TypeMap = Dict<TypeInterface>

// export const normalizeGeneric = (typeMap: TypeMap): TypeMap => {}

export const getGraphTypeMapByPath = (
  path: string,
  specs: Specs,
  cache: { [path: string]: TypeTreeInterface } = {},
  visited: { [path: string]: true } = {}
): TypeMap => {
  const typeTreeMap = _getGraphTypeMapByPath(path, specs, cache, visited)
  return typeTreeMapToTypeMap(typeTreeMap)
}

export const _getGraphTypeMapByPath = (
  path: string,
  specs: Specs,
  cache: { [path: string]: TypeTreeInterface } = {},
  visited: { [path: string]: true } = {}
): TypeTreeMap => {
  const spec = specs[path] as GraphSpec
  // console.log('_getGraphTypeMapByPath', path)
  return _getGraphTypeMap(spec, specs, cache, { ...visited, [path]: true })
}

export const getGraphTypeMap = (
  spec: GraphSpec,
  specs: Specs,
  cache: { [path: string]: TypeTreeInterface } = {},
  visited: { [path: string]: true } = {}
): TypeMap => {
  const typeTreeMap = _getGraphTypeMap(spec, specs, cache, visited)
  return typeTreeMapToTypeMap(typeTreeMap)
}

export const _getGraphTypeMap = (
  spec: GraphSpec,
  specs: Specs,
  cache: { [path: string]: TypeTreeInterface } = {},
  visited: { [path: string]: true } = {}
): TypeTreeMap => {
  const typeMap: TypeTreeMap = {}

  const subgraphs = getSubgraphs(spec)

  const { units = {}, merges = {}, outputs = {}, inputs = {} } = spec

  subgraphs.forEach((subgraph: Subgraph) => {
    const { unit, merge } = subgraph
    let charCode = 65
    let replacement: Dict<Dict<string>> = {}

    forEachKeyValue(unit, (_, unitId: string) => {
      const unitSpec = units[unitId]
      const { id, input = {} } = unitSpec
      let unitTypeInterface: TypeTreeInterface
      if (visited[id]) {
        unitTypeInterface = createGenericTypeInterface(id, specs)
      } else {
        unitTypeInterface = clone(
          _getSpecTypeInterfaceByPath(id, specs, cache, visited)
        )
        // unitTypeInterface = _getSpecTypeInterfaceByPath(
        //   path,
        //   specs,
        //   cache,
        //   visited
        // )
      }

      replacement[unitId] = {}

      function register(type: TreeNode, kind: IO, pinId: string): void {
        if (_hasGeneric(type)) {
          const generics = _findGenerics(type)
          for (const generic of generics) {
            if (!replacement[unitId][generic]) {
              replacement[unitId][generic] = `<${String.fromCharCode(
                charCode++
              )}>`
            }
          }
          unitTypeInterface[kind][pinId] = _applyGenerics(
            type,
            replacement[unitId]
          )
        }
      }
      forEachKeyValue(unitTypeInterface.input, (type, inputId) => {
        if (
          input[inputId] &&
          input[inputId].constant &&
          input[inputId].data !== undefined
        ) {
          if (_hasGeneric(type)) {
            const dataStr = unitSpec.input[inputId].data
            const dataTree = getTree(dataStr)
            const dataTypeTree = _getValueType(specs, dataTree)
            if (!_hasGeneric(dataTypeTree)) {
              unitTypeInterface['input'][inputId] = dataTypeTree
              const extracted_generic = _extractGenerics(
                specs,
                dataTypeTree,
                type
              )
              forEachKeyValue(extracted_generic, (value, generic) => {
                replacement[unitId][generic] = value
              })
            }
          }
        }
      })
      forEachKeyValue(unitTypeInterface.input, (type, inputId) => {
        register(type, 'input', inputId)
      })
      forEachKeyValue(unitTypeInterface.output, (type, outputId) =>
        register(type, 'output', outputId)
      )
      typeMap[unitId] = unitTypeInterface
    })

    const equivalence: Set<string>[] = []
    const equivalence_index: Dict<number> = {}

    let i = 0

    const create_set_equivalent = () => {
      let equivalence_set = new Set<string>()
      let merged = false
      function set_equivalent(unitId: string, kind: IO, pinId: string) {
        // AD HOC unit might've removed from subgraph
        if (!typeMap[unitId]) {
          return
        }

        const type = typeMap[unitId][kind][pinId]

        // AD HOC
        // SELF
        if (!type) {
          return
        }

        // do not set equivalence to any
        if (type.type === TreeNodeType.Any) {
          return
        }

        if (equivalence_index[type.value] !== undefined) {
          merged = true
          i = equivalence_index[type.value]
          equivalence[i] = new Set([
            ...(equivalence[i] || []),
            ...equivalence_set,
          ])
          equivalence_set.forEach((t) => {
            equivalence_index[t] = i
          })
          equivalence_set = equivalence[i]
        } else {
          equivalence_set.add(type.value)
          equivalence_index[type.value] = i
        }
        if (!merged) {
          equivalence.push(equivalence_set)
        }
        i = equivalence.length
      }
      return set_equivalent
    }

    const set_merge_equivalence = (
      mergeId: string,
      set_equivalent: (unitId: string, kind: IO, pinId: string) => void
    ): void => {
      const mergeSpec = merges[mergeId]
      forEachPinOnMerge(mergeSpec, (unitId, kind, pinId) => {
        set_equivalent(unitId, kind, pinId)
      })
    }

    const set_exposed_equivalence = (
      kind: IO,
      pinId: string,
      set_equivalent: (unitId: string, kind: IO, pinId: string) => void
    ): void => {
      const { pin } = spec[`${kind}s`][pinId]
      forEachKeyValue(pin, ({ unitId, pinId, mergeId }) => {
        if (mergeId) {
          set_merge_equivalence(mergeId, set_equivalent)
        } else if (unitId && pinId) {
          set_equivalent(unitId, kind, pinId)
        }
      })
    }

    forEachKeyValue(merge, (_, mergeId: string) => {
      const set_equivalent = create_set_equivalent()
      set_merge_equivalence(mergeId, set_equivalent)
    })

    forEachKeyValue(inputs, (_, inputId) => {
      const set_equivalent = create_set_equivalent()
      set_exposed_equivalence('input', inputId, set_equivalent)
    })

    forEachKeyValue(outputs, (_, outputId) => {
      const set_equivalent = create_set_equivalent()
      set_exposed_equivalence('output', outputId, set_equivalent)
    })

    const specific = equivalence.map((equivalence_set) => {
      let mostSpecific = undefined
      for (let t of equivalence_set) {
        if (mostSpecific === undefined) {
          mostSpecific = t
        } else {
          mostSpecific = moreSpecific(mostSpecific, t)
        }
      }
      return mostSpecific as string
    })

    const generic_to_substitute: Dict<string> = {}
    equivalence.forEach((equivalence_set, index) => {
      for (const t of equivalence_set) {
        const mostSpecific = specific[index]
        const extracted = extractGenerics(specs, mostSpecific, t)
        for (const generic in extracted) {
          const extract = extracted[generic]
          let substitution: string
          if (generic_to_substitute[generic] === undefined) {
            substitution = extract
          } else {
            const prev_substitution = generic_to_substitute[generic]
            substitution = moreSpecific(extract, prev_substitution)
            if (substitution !== extract) {
              for (let g in generic_to_substitute) {
                generic_to_substitute[g] = applyGenerics(
                  generic_to_substitute[g],
                  {
                    [extract]: substitution,
                  }
                )
              }
            }
            if (prev_substitution !== substitution) {
              for (const gen in generic_to_substitute) {
                generic_to_substitute[gen] = applyGenerics(
                  generic_to_substitute[gen],
                  {
                    [prev_substitution]: substitution,
                  }
                )
              }
            }
          }
          generic_to_substitute[generic] = substitution
        }
      }
    })

    // console.log(spec.name, 'equivalence', equivalence)
    // console.log(spec.name, 'generic_to_substitute', generic_to_substitute)

    const substitute_replacement: Dict<string> = {}
    charCode = 65
    forEachKeyValue(generic_to_substitute, (value, key) => {
      const generics = findGenerics(value)
      for (let generic of generics) {
        if (!substitute_replacement[generic]) {
          substitute_replacement[generic] = `<${String.fromCharCode(
            charCode++
          )}>`
        }
        generic_to_substitute[key] = applyGenerics(
          generic_to_substitute[key],
          substitute_replacement
        )
      }
    })

    // console.log('typeMap', JSON.stringify(typeMap, null, 2))
    // console.log('equivalence_index', equivalence_index)
    // console.log('specific', specific)
    // console.log('substitute_replacement', substitute_replacement)

    forEachKeyValue(unit, (_, unitId: string) => {
      const unitTypeMap = typeMap[unitId]
      const { input, output } = unitTypeMap
      forEachKeyValue(input, (type, pinId) => {
        const nextType = _applyGenerics(type, generic_to_substitute)
        unitTypeMap.input[pinId] = nextType
      })
      forEachKeyValue(output, (type, pinId) => {
        const nextType = _applyGenerics(type, generic_to_substitute)
        unitTypeMap.output[pinId] = nextType
      })
    })
  })

  return typeMap
}

export type Subgraph = {
  unit: Dict<boolean>
  merge: Dict<boolean>
}

export const getSubgraphs = (spec: GraphSpec): Subgraph[] => {
  const index_to_subgraph: Subgraph[] = []
  const id_to_index: {
    unit: Dict<number>
    merge: Dict<number>
  } = { unit: {}, merge: {} }

  const { units = {}, merges = {} } = spec

  let i = 0

  forEachKeyValue(merges, (merge: GraphMergeSpec, mergeId: string) => {
    let subgraph: Subgraph = { unit: {}, merge: {} }
    subgraph.merge[mergeId] = true
    let merged = false
    let index = i
    forEachKeyValue(merge, (_, unitId) => {
      subgraph.unit[unitId] = true
      const unit_index = id_to_index.unit[unitId]
      if (unit_index !== undefined) {
        merged = true
        if (unit_index < index) {
          forEachKeyValue(subgraph.unit, (_, unitId) => {
            id_to_index.unit[unitId] = unit_index
          })
          forEachKeyValue(subgraph.merge, (_, mergeId) => {
            id_to_index.merge[mergeId] = unit_index
          })
          subgraph = deepMerge(
            index_to_subgraph[unit_index],
            subgraph
          ) as Subgraph
          index_to_subgraph.splice(index, 1)
          index = unit_index
        }
      }
      id_to_index.unit[unitId] = index
    })
    if (!merged) {
      i++
    }
    id_to_index.merge[mergeId] = index
    index_to_subgraph[index] = subgraph
  })

  forEachKeyValue(units, (_, unitId: string) => {
    if (id_to_index.unit[unitId] === undefined) {
      const subgraph: Subgraph = { unit: { [unitId]: true }, merge: {} }
      index_to_subgraph.push(subgraph)
      id_to_index.unit[unitId] = i
      i++
    }
  })
  return index_to_subgraph
}
