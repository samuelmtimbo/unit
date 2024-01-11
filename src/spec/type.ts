import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import deepMerge from '../system/f/object/DeepMerge/f'
import { keys } from '../system/f/object/Keys/f'
import { Spec, Specs } from '../types'
import { BaseSpec } from '../types/BaseSpec'
import { Dict } from '../types/Dict'
import { GraphMergeSpec } from '../types/GraphMergeSpec'
import { GraphSpec } from '../types/GraphSpec'
import { IO } from '../types/IO'
import { IOOf, io } from '../types/IOOf'
import { clone, isEmptyObject, mapObjVK, pathOrDefault } from '../util/object'
import { emptyIO } from './emptyIO'
import {
  ANY_TREE,
  TreeNode,
  TreeNodeType,
  _applyGenerics,
  _extractGenerics,
  _findGenerics,
  _getValueType,
  _hasGeneric,
  _isGeneric,
  applyGenerics,
  checkClassInheritance,
  extractGenerics,
  findGenerics,
  getTree,
  isGeneric,
} from './parser'
import { findFirstMergePin, forEachPinOnMerge } from './util/spec'

export type TypeInterface = IOOf<Dict<string>>
export type TypeTreeInterface = IOOf<Dict<TreeNode>>
export type TypeTreeInterfaceCache = Dict<TypeTreeInterface>

export const getSpecTypeInterfaceById = (
  id: string,
  specs: Specs,
  cache: TypeTreeInterfaceCache = {},
  visited: { [id: string]: true } = {}
): TypeInterface => {
  const typeInterface = _getSpecTypeInterfaceById(id, specs, cache, visited)
  return typeTreeToType(typeInterface)
}

export const _getSpecTypeInterfaceById = (
  id: string,
  specs: Specs,
  cache: TypeTreeInterfaceCache = {},
  visited: { [id: string]: true } = {}
): TypeTreeInterface => {
  let typeInterface: TypeTreeInterface
  if (cache[id]) {
    typeInterface = cache[id]
  } else {
    const spec = specs[id]
    if (!spec) {
      throw new Error(`spec not found ${id}`)
    }
    typeInterface = _getSpecTypeInterface(spec, specs, cache, {
      ...visited,
      [id]: true,
    })
    cache[id] = typeInterface
  }
  return typeInterface
}

export const typeTreeToType = (
  typeTreeInterface: TypeTreeInterface
): TypeInterface => {
  const { input, output } = typeTreeInterface
  const typeInterface: TypeInterface = emptyIO({}, {})
  for (const inputId in input) {
    const inputTree = input[inputId]
    typeInterface.input[inputId] = inputTree.value
  }
  for (const outputId in output) {
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
  cache: TypeTreeInterfaceCache = {},
  visited: { [id: string]: true } = {}
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

export const _getBaseTypeInterfaceById = (
  id: string,
  specs: Specs
): TypeTreeInterface => {
  const spec = specs[id] as BaseSpec
  return _getBaseTypeInterface(spec)
}

export const _getBaseTypeInterface = (spec: BaseSpec): TypeTreeInterface => {
  const typeInterface: TypeTreeInterface = emptyIO({}, {})
  forEachValueKey(spec.inputs, ({ type }, inputId) => {
    typeInterface.input[inputId] = getTree(type)
  })
  forEachValueKey(spec.outputs, ({ type }, outputId) => {
    typeInterface.output[outputId] = getTree(type)
  })
  return typeInterface
}

export const _getGraphTypeInterfaceById = (
  id: string,
  specs: Specs,
  cache: TypeTreeInterfaceCache = {},
  visited: { [id: string]: true } = {}
): TypeTreeInterface => {
  // console.log('_getGraphTypeInterfaceById', id)
  const spec = specs[id] as GraphSpec
  return _getGraphTypeInterface(spec, specs, cache, visited)
}

export const getGraphTypeInterface = (
  spec: GraphSpec,
  specs: Specs,
  cache: TypeTreeInterfaceCache = {},
  visited: { [id: string]: true } = {}
) => {
  const graphTypeTree = _getGraphTypeInterface(spec, specs, cache, visited)
  return typeTreeToType(graphTypeTree)
}

export const _getGraphTypeInterface = (
  spec: GraphSpec,
  specs: Specs,
  cache: TypeTreeInterfaceCache = {},
  visited: { [id: string]: true } = {}
): TypeTreeInterface => {
  // console.log('_getGraphTypeInterface')

  const typeInterface: TypeTreeInterface = emptyIO({}, {})

  const unitTypeMap = _getGraphTypeMap(spec, specs, cache, visited)

  const { inputs = {}, outputs = {} } = spec

  forEachValueKey(inputs, ({ plug, type }, inputId) => {
    let inputType = getTree('any')

    if (type) {
      inputType = getTree(type)
    } else {
      forEachValueKey(plug, ({ mergeId, unitId, pinId, kind = 'input' }) => {
        let subPinType: TreeNode

        if (mergeId) {
          const merge = spec.merges[mergeId] ?? {}

          // AD HOC
          if (isEmptyObject(merge)) {
            return
          }

          const mergeInputPin = findFirstMergePin(merge, 'input')

          subPinType = pathOrDefault(
            unitTypeMap,
            [mergeInputPin.unitId, 'input', mergeInputPin.pinId],
            undefined
          )
        } else if (unitId && pinId) {
          subPinType = pathOrDefault(
            unitTypeMap,
            [unitId, kind, pinId],
            undefined
          )
        }

        if (subPinType) {
          inputType = _mostSpecific(inputType, subPinType)
        }
      })
    }
    typeInterface.input[inputId] = inputType
  })

  forEachValueKey(outputs, ({ plug, type }, outputId) => {
    let outputType = getTree('any')

    if (type) {
      outputType = getTree(type)
    } else {
      forEachValueKey(plug, ({ mergeId, unitId, pinId, kind = 'output' }) => {
        let subPinType

        if (mergeId) {
          const merge = spec.merges[mergeId]

          let type: TreeNode

          forEachPinOnMerge(merge, (unitId, kind, pinId) => {
            if (kind === 'output') {
              if (!type) {
                type = pathOrDefault(
                  unitTypeMap,
                  [unitId, 'output', pinId],
                  ANY_TREE
                )
              } else {
                type = _leastSpecific(
                  type,
                  pathOrDefault(
                    unitTypeMap,
                    [unitId, 'output', pinId],
                    ANY_TREE
                  )
                )
              }
            }
          })

          subPinType = type
        } else if (unitId && pinId) {
          subPinType = pathOrDefault(
            unitTypeMap,
            [unitId, kind, pinId],
            undefined
          )
        }

        if (subPinType) {
          outputType = _mostSpecific(outputType, subPinType)
        }
      })
    }
    typeInterface.output[outputId] = outputType
  })

  let i = 65
  const replacement: { [generic: string]: string } = {}
  const { input, output } = typeInterface
  const inputPinIds = keys(input).sort()
  const outputPinIds = keys(output).sort()
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
  id: string,
  specs: Specs
): TypeTreeInterface => {
  // console.log('createGenericTypeInterface', id)
  const spec = specs[id]
  const typeInterface: TypeTreeInterface = emptyIO({}, {})

  let i = 0

  const inputIds = keys(spec.inputs)
  const outputIds = keys(spec.outputs)

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
    if (a.type === TreeNodeType.Class && b.type === TreeNodeType.Class) {
      return !checkClassInheritance(a.value, b.value)
    }

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

export const mostSpecific = (a: string, b: string): string => {
  if (isMoreSpecific(a, b)) {
    return a
  } else {
    return b
  }
}

export const _mostSpecific = (a: TreeNode, b: TreeNode): TreeNode => {
  if (_isMoreSpecific(a, b)) {
    return a
  } else {
    return b
  }
}

export const leastSpecific = (a: string, b: string): string => {
  if (isMoreSpecific(a, b)) {
    return b
  } else {
    return a
  }
}

export const _leastSpecific = (a: TreeNode, b: TreeNode): TreeNode => {
  if (_isMoreSpecific(a, b)) {
    return b
  } else {
    return a
  }
}

export type TypeTreeMap = Dict<TypeTreeInterface>
export type TypeMap = Dict<TypeInterface>

export const getGraphTypeMapById = (
  id: string,
  specs: Specs,
  cache: TypeTreeInterfaceCache = {},
  visited: { [id: string]: true } = {}
): TypeMap => {
  const typeTreeMap = _getGraphTypeMapById(id, specs, cache, visited)
  return typeTreeMapToTypeMap(typeTreeMap)
}

export const _getGraphTypeMapById = (
  id: string,
  specs: Specs,
  cache: TypeTreeInterfaceCache = {},
  visited: { [id: string]: true } = {}
): TypeTreeMap => {
  const spec = specs[id] as GraphSpec
  // console.log('_getGraphTypeMapById', id)
  return _getGraphTypeMap(spec, specs, cache, { ...visited, [id]: true })
}

export const getGraphTypeMap = (
  spec: GraphSpec,
  specs: Specs,
  cache: TypeTreeInterfaceCache = {},
  visited: { [id: string]: true } = {}
): TypeMap => {
  const typeTreeMap = _getGraphTypeMap(spec, specs, cache, visited)
  return typeTreeMapToTypeMap(typeTreeMap)
}

export const _getGraphTypeMap = (
  spec: GraphSpec,
  specs: Specs,
  cache: TypeTreeInterfaceCache = {},
  visited: { [id: string]: true } = {}
): TypeTreeMap => {
  const typeMap: TypeTreeMap = {}

  const subgraphs = getSubgraphs(spec)

  const { units = {}, merges = {}, outputs = {}, inputs = {} } = clone(spec)

  subgraphs.forEach((subgraph: Subgraph) => {
    const { unit, merge } = subgraph

    let charCode = 65

    const replacement: Dict<Dict<string>> = {}

    forEachValueKey(unit, (_, unitId: string) => {
      const unitSpec = units[unitId]

      // AD HOC
      if (!unitSpec) {
        return
      }

      const { id, input = {} } = unitSpec

      let unitTypeInterface: TypeTreeInterface
      if (visited[id]) {
        unitTypeInterface = createGenericTypeInterface(id, specs)
      } else {
        unitTypeInterface = clone(
          _getSpecTypeInterfaceById(id, specs, cache, visited)
        )
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
      forEachValueKey(unitTypeInterface.input, (type, inputId) => {
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
              forEachValueKey(extracted_generic, (value, generic) => {
                replacement[unitId][generic] = value
              })
            }
          }
        }
      })
      forEachValueKey(unitTypeInterface.input, (type, inputId) => {
        register(type, 'input', inputId)
      })
      forEachValueKey(unitTypeInterface.output, (type, outputId) =>
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
        const type = pathOrDefault(typeMap, [unitId, kind, pinId], undefined)

        // AD HOC
        if (!type) {
          return
        }

        // do not set equivalence to any
        if (type.type === TreeNodeType.Any) {
          return
        }

        if (equivalence_index[type.value] === undefined) {
          equivalence_set.add(type.value)

          if (_isGeneric(type)) {
            equivalence_index[type.value] = i
          }
        } else {
          merged = true

          i = equivalence_index[type.value]

          equivalence[i] = new Set([
            ...(equivalence[i] || []),
            ...equivalence_set,
          ])

          equivalence_set.forEach((j) => {
            equivalence_index[j] = i
          })

          equivalence_set = equivalence[i]
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
      const { plug } = spec[`${kind}s`][pinId]

      forEachValueKey(plug, ({ unitId, pinId, mergeId }) => {
        if (mergeId) {
          set_merge_equivalence(mergeId, set_equivalent)
        } else if (unitId && pinId) {
          set_equivalent(unitId, kind, pinId)
        }
      })
    }

    forEachValueKey(merge, (_, mergeId: string) => {
      const set_equivalent = create_set_equivalent()

      set_merge_equivalence(mergeId, set_equivalent)
    })

    forEachValueKey(inputs, (_, inputId) => {
      const set_equivalent = create_set_equivalent()

      set_exposed_equivalence('input', inputId, set_equivalent)
    })

    forEachValueKey(outputs, (_, outputId) => {
      const set_equivalent = create_set_equivalent()

      set_exposed_equivalence('output', outputId, set_equivalent)
    })

    const specific = equivalence.map((equivalence_set) => {
      let theMostSpecific = undefined

      for (const t of equivalence_set) {
        if (theMostSpecific === undefined) {
          theMostSpecific = t
        } else {
          theMostSpecific = mostSpecific(theMostSpecific, t)
        }
      }

      return theMostSpecific as string
    })

    const generic_to_substitute: Dict<string> = {}

    equivalence.forEach((equivalence_set, index) => {
      for (const t of equivalence_set) {
        const theMostSpecific = specific[index]

        const extracted = extractGenerics(specs, theMostSpecific, t)

        for (const generic in extracted) {
          const extract = extracted[generic]

          let substitution: string

          if (generic_to_substitute[generic] === undefined) {
            substitution = extract
          } else {
            const prev_substitution = generic_to_substitute[generic]

            substitution = mostSpecific(extract, prev_substitution)

            if (!isGeneric(substitution)) {
              if (substitution !== extract) {
                for (const g in generic_to_substitute) {
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
          }

          generic_to_substitute[generic] = substitution
        }
      }
    })

    const substitute_replacement: Dict<string> = {}
    const generic_to_substitute_: Dict<string> = {}

    charCode = 65
    forEachValueKey(generic_to_substitute, (value, key) => {
      generic_to_substitute_[key] = value

      const generics = findGenerics(value)

      for (const generic of generics) {
        if (!substitute_replacement[generic]) {
          substitute_replacement[generic] = `<${String.fromCharCode(
            charCode++
          )}>`
        }
        generic_to_substitute_[key] = applyGenerics(
          value,
          substitute_replacement
        )
      }
    })

    forEachValueKey(unit, (_, unitId: string) => {
      const unitTypeMap = typeMap[unitId]

      if (!unitTypeMap) {
        return
        // throw new Error('type map not found')
      }

      io((kind: IO) => {
        const pinTypeMap = unitTypeMap[kind]

        forEachValueKey(pinTypeMap, (type, pinId) => {
          const nextType = _applyGenerics(type, generic_to_substitute_)

          unitTypeMap[kind][pinId] = nextType
        })
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

  forEachValueKey(merges, (merge: GraphMergeSpec, mergeId: string) => {
    let subgraph: Subgraph = { unit: {}, merge: {} }
    subgraph.merge[mergeId] = true
    let merged = false
    let index = i
    forEachValueKey(merge, (mergeUnit, unitId) => {
      // empty merge
      if (isEmptyObject(mergeUnit)) {
        return
      }

      subgraph.unit[unitId] = true
      const unit_index = id_to_index.unit[unitId]
      if (unit_index !== undefined) {
        merged = true
        if (unit_index < index) {
          forEachValueKey(subgraph.unit, (_, unitId) => {
            id_to_index.unit[unitId] = unit_index
          })
          forEachValueKey(subgraph.merge, (_, mergeId) => {
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

  forEachValueKey(units, (_, unitId: string) => {
    if (id_to_index.unit[unitId] === undefined) {
      const subgraph: Subgraph = { unit: { [unitId]: true }, merge: {} }
      index_to_subgraph.push(subgraph)
      id_to_index.unit[unitId] = i
      i++
    }
  })
  return index_to_subgraph
}
