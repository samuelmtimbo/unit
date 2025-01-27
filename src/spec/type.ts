import { SELF } from '../constant/SELF'
import { DataRef } from '../DataRef'
import { deepSet_ } from '../deepSet'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import deepMerge from '../system/f/object/DeepMerge/f'
import { keys } from '../system/f/object/Keys/f'
import { Spec, Specs } from '../types'
import { BaseSpec } from '../types/BaseSpec'
import { Dict } from '../types/Dict'
import { GraphMergeSpec } from '../types/GraphMergeSpec'
import { GraphSpec } from '../types/GraphSpec'
import { IO } from '../types/IO'
import { IOOf, forIOObjKV, forIOObjVK } from '../types/IOOf'
import { clone } from '../util/clone'
import { deepGetOrDefault, isEmptyObject, mapObjVK } from '../util/object'
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
import { stringifyDataValue } from './stringifyDataValue'
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
      visited,
      true
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
  cache: TypeTreeInterfaceCache,
  visited: { [id: string]: true },
  includeData: boolean
): TypeTreeInterface => {
  // console.log('_getGraphTypeInterfaceById', id)
  const spec = specs[id] as GraphSpec
  return _getGraphTypeInterface(spec, specs, cache, visited, includeData)
}

export const getGraphTypeInterface = (
  spec: GraphSpec,
  specs: Specs,
  cache: TypeTreeInterfaceCache,
  visited: { [id: string]: true },
  includeData: boolean
) => {
  const graphTypeTree = _getGraphTypeInterface(
    spec,
    specs,
    cache,
    visited,
    includeData
  )

  return typeTreeToType(graphTypeTree)
}

export const _getGraphTypeInterface = (
  spec: GraphSpec,
  specs: Specs,
  cache: TypeTreeInterfaceCache,
  visited: { [id: string]: true },
  includeData: boolean
): TypeTreeInterface => {
  // console.log('_getGraphTypeInterface')

  const typeInterface: TypeTreeInterface = emptyIO({}, {})

  const unitTypeMap = _getGraphTypeMap(spec, specs, cache, visited, includeData)

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

          if (isEmptyObject(merge)) {
            return
          }

          const mergeInputPin = findFirstMergePin(merge, 'input')

          subPinType = deepGetOrDefault(
            unitTypeMap,
            [mergeInputPin.unitId, 'input', mergeInputPin.pinId],
            undefined
          )
        } else if (unitId && pinId) {
          if (kind === 'input') {
            subPinType = deepGetOrDefault(
              unitTypeMap,
              [unitId, kind, pinId],
              undefined
            )
          }
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
                type = deepGetOrDefault(
                  unitTypeMap,
                  [unitId, 'output', pinId],
                  ANY_TREE
                )
              } else {
                type = _leastSpecific(
                  type,
                  deepGetOrDefault(
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
          if (pinId === SELF) {
            const unit = spec.units[unitId]

            const unitSpec = specs[unit.id]

            subPinType =
              (unitSpec.type && getTree(unitSpec.type)) || getTree('any')
          } else {
            subPinType = deepGetOrDefault(
              unitTypeMap,
              [unitId, kind, pinId],
              undefined
            )
          }
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

  let charCode = 65

  const inputIds = keys(spec.inputs)
  const outputIds = keys(spec.outputs)

  function register(kind: IO, pinId: string): void {
    typeInterface[kind][pinId] = getTree(`<${String.fromCharCode(charCode)}>`)
    charCode++
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
  visited: { [id: string]: true } = {},
  includeData: boolean = true
): TypeMap => {
  const typeTreeMap = _getGraphTypeMapById(
    id,
    specs,
    cache,
    visited,
    includeData
  )
  return typeTreeMapToTypeMap(typeTreeMap)
}

export const _getGraphTypeMapById = (
  id: string,
  specs: Specs,
  cache: TypeTreeInterfaceCache = {},
  visited: { [id: string]: true } = {},
  includeData: boolean = true
): TypeTreeMap => {
  const spec = specs[id] as GraphSpec
  // console.log('_getGraphTypeMapById', id)
  return _getGraphTypeMap(
    spec,
    specs,
    cache,
    { ...visited, [id]: true },
    includeData
  )
}

export const getGraphTypeMap = (
  spec: GraphSpec,
  specs: Specs,
  cache: TypeTreeInterfaceCache = {},
  visited: { [id: string]: true } = {},
  includeData: boolean = true
): TypeMap => {
  const typeTreeMap = _getGraphTypeMap(spec, specs, cache, visited, includeData)
  return typeTreeMapToTypeMap(typeTreeMap)
}

export const _getGraphTypeMap = (
  spec: GraphSpec,
  specs: Specs,
  cache: TypeTreeInterfaceCache,
  visited: { [id: string]: true },
  includeData: boolean
): TypeTreeMap => {
  const typeMap: TypeTreeMap = {}

  const { units = {}, merges = {}, outputs = {}, inputs = {} } = clone(spec)

  let charCode = 65

  const genericReplacement: Dict<Dict<string>> = {}
  const dataReplacement: Dict<Dict<string>> = {}
  const genericToSubstitute: Dict<string> = {}

  const globalSubstituteReplacement: Dict<string> = {}
  const globalGenericTosubstitute: Dict<string> = {}
  const globalGenericReplacement: Dict<string> = {}

  forEachValueKey(units, (_, unitId: string) => {
    const unitSpec = units[unitId]

    const { id, input = {} } = unitSpec

    let unitTypeInterface: TypeTreeInterface
    if (visited[id]) {
      unitTypeInterface = createGenericTypeInterface(id, specs)
    } else {
      unitTypeInterface = clone(
        _getSpecTypeInterfaceById(id, specs, cache, visited)
      )
    }

    genericReplacement[unitId] = {}
    dataReplacement[unitId] = {}

    function register(type: TreeNode, kind: IO, pinId: string): void {
      if (_hasGeneric(type)) {
        const generics = _findGenerics(type)
        for (const generic of generics) {
          if (!genericReplacement[unitId][generic]) {
            genericReplacement[unitId][generic] = `<${String.fromCharCode(
              charCode++
            )}>`
          }
        }
        unitTypeInterface[kind][pinId] = _applyGenerics(
          type,
          genericReplacement[unitId]
        )
      }
    }

    forEachValueKey(unitTypeInterface.input, (type, inputId) => {
      register(type, 'input', inputId)
    })
    forEachValueKey(unitTypeInterface.output, (type, outputId) => {
      register(type, 'output', outputId)
    })

    forEachValueKey(unitTypeInterface.input, (type, inputId) => {
      if (
        (input[inputId] &&
          input[inputId].constant &&
          typeof input[inputId].data === 'string') ||
        (typeof input?.[inputId]?.data === 'object' &&
          input[inputId].data !== null &&
          (input[inputId].data as DataRef).data !== undefined)
      ) {
        if (_hasGeneric(type)) {
          if (includeData) {
            const dataStr = stringifyDataValue(
              unitSpec.input[inputId].data,
              specs,
              {}
            )
            const dataTree = getTree(dataStr)
            const dataTypeTree = _getValueType(specs, dataTree)
            if (!_hasGeneric(dataTypeTree)) {
              unitTypeInterface['input'][inputId] = dataTypeTree

              const extractedGenerics = _extractGenerics(
                specs,
                dataTypeTree,
                type
              )
              forEachValueKey(extractedGenerics, (value, generic) => {
                const replacedGeneric =
                  genericReplacement[unitId][generic] ?? generic

                deepSet_(dataReplacement, [unitId, replacedGeneric], value)
              })
            }
          }
        }
      }
    })

    typeMap[unitId] = unitTypeInterface
  })

  forEachValueKey(units, (_, unitId: string) => {
    const unitTypeInterface: TypeTreeInterface = typeMap[unitId]

    function register(type: TreeNode, kind: IO, pinId: string): void {
      if (_hasGeneric(type)) {
        unitTypeInterface[kind][pinId] = _applyGenerics(
          type,
          dataReplacement[unitId] ?? {}
        )
      }
    }

    forIOObjVK(unitTypeInterface, (type_, type, pinId) => {
      register(type, type_, pinId)
    })

    typeMap[unitId] = unitTypeInterface
  })

  const equivalence: Set<string>[] = []
  const equivalence_index: Dict<number> = {}

  let i = 0

  const create_set_equivalent = (data: boolean) => {
    let equivalence_set = new Set<string>()

    let merged = false

    function set_equivalent(unitId: string, kind: IO, pinId: string) {
      const type = deepGetOrDefault(typeMap, [unitId, kind, pinId], undefined)

      if (!type) {
        return
      }

      if (type.type === TreeNodeType.Any) {
        return
      }

      if (equivalence_index[type.value] === undefined) {
        if (_isGeneric(type)) {
          equivalence_set.add(type.value)
          equivalence_index[type.value] = i
        } else {
          if (!data || includeData || kind === 'input') {
            equivalence_set.add(type.value)
          }
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

  forEachValueKey(merges, (_, mergeId: string) => {
    const set_equivalent = create_set_equivalent(false)

    set_merge_equivalence(mergeId, set_equivalent)
  })

  forEachValueKey(inputs, (_, inputId) => {
    const set_equivalent = create_set_equivalent(true)

    set_exposed_equivalence('input', inputId, set_equivalent)
  })

  forEachValueKey(outputs, (_, outputId) => {
    const set_equivalent = create_set_equivalent(true)

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

  equivalence.forEach((equivalence_set, index) => {
    for (const t of equivalence_set) {
      const theMostSpecific = specific[index]

      const extracted = extractGenerics(specs, theMostSpecific, t)

      for (const generic in extracted) {
        const extract = extracted[generic]

        let substitution: string

        if (genericToSubstitute[generic] === undefined) {
          substitution = extract
        } else {
          const prev_substitution = genericToSubstitute[generic]

          substitution = mostSpecific(extract, prev_substitution)

          if (!isGeneric(substitution)) {
            if (substitution !== extract) {
              for (const g in genericToSubstitute) {
                genericToSubstitute[g] = applyGenerics(genericToSubstitute[g], {
                  [extract]: substitution,
                })
              }
            }

            if (prev_substitution !== substitution) {
              for (const gen in genericToSubstitute) {
                genericToSubstitute[gen] = applyGenerics(
                  genericToSubstitute[gen],
                  {
                    [prev_substitution]: substitution,
                  }
                )
              }
            }
          }
        }

        genericToSubstitute[generic] = substitution
      }
    }
  })

  charCode = 65
  forEachValueKey(genericToSubstitute, (value, key) => {
    globalGenericTosubstitute[key] = value

    const generics = findGenerics(value)

    for (const generic of generics) {
      if (!globalSubstituteReplacement[generic]) {
        globalSubstituteReplacement[generic] =
          `<${String.fromCharCode(charCode++)}>`
      }
      globalGenericTosubstitute[key] = applyGenerics(
        value,
        globalSubstituteReplacement
      )
    }
  })

  forEachValueKey(units, (_, unitId: string) => {
    const unitTypeMap = typeMap[unitId]

    forEachValueKey(unitTypeMap['output'], (type, pinId) => {
      const nextType = _applyGenerics(type, globalGenericTosubstitute)

      unitTypeMap['output'][pinId] = nextType
    })

    forEachValueKey(unitTypeMap['input'], (type, pinId) => {
      const nextType = _applyGenerics(type, globalGenericTosubstitute)

      unitTypeMap['input'][pinId] = nextType
    })
  })

  charCode = 65

  forEachValueKey(units, (_, unitId: string) => {
    const unitTypeInterface: TypeTreeInterface = typeMap[unitId]

    function register(type: TreeNode, kind: IO, pinId: string): void {
      if (_hasGeneric(type)) {
        const generics = _findGenerics(type)

        for (const generic of generics) {
          if (!globalGenericReplacement[generic]) {
            globalGenericReplacement[generic] = `<${String.fromCharCode(
              charCode++
            )}>`
          }
        }
        unitTypeInterface[kind][pinId] = _applyGenerics(
          type,
          globalGenericReplacement
        )
      }
    }

    forIOObjKV(unitTypeInterface, (type_, pinId, type) => {
      register(type, type_, pinId)
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
