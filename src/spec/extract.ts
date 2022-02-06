import assocPath from '../system/core/object/AssocPath/f'
import { GraphMergeSpec, GraphSpec, Specs } from '../types'
import { Dict } from '../types/Dict'
import { IO } from '../types/IO'

export type GraphSpecSelection = {
  units?: string[]
  unitInputs?: Dict<string[]>
  unitOutputs?: Dict<string[]>
  merges?: string[]
  datas?: string[]
  inputs?: {
    pinId: string
    subPinId: string
  }[]
  outputs?: {
    pinId: string
    subPinId: string
  }[]
}

export function extractSubSpec(
  specs: Specs,
  spec: GraphSpec,
  selection: GraphSpecSelection,
  newUnitId: string,
  newSpecId: string
): [GraphSpec, GraphSpec] {
  let parentSpec: GraphSpec = {}
  let newSpec: GraphSpec = {}

  const {
    units = [],
    unitInputs = {},
    unitOutputs = {},
    merges = [],
    datas = [],
    inputs = [],
    outputs = [],
  } = selection

  const subUnitSet = new Set(units)
  const subMergeSet = new Set(merges)

  const subUnitInputToMerges: Dict<Dict<string>> = {}
  const subUnitOutputToMerges: Dict<Dict<string>> = {}
  for (const mergeId of merges) {
    const merge = spec.merges[mergeId]
    for (const unitId in merge) {
      subUnitInputToMerges[unitId] = subUnitInputToMerges[unitId] || {}
      subUnitOutputToMerges[unitId] = subUnitOutputToMerges[unitId] || {}
      const mergeUnit = merge[unitId]
      const { input = {}, output = {} } = mergeUnit
      for (const inputId in input) {
        subUnitInputToMerges[unitId][inputId] = mergeId
      }
      for (const outputId in output) {
        subUnitOutputToMerges[unitId][outputId] = mergeId
      }
    }
  }

  const subUnitInputSets: Dict<Set<string>> = {}
  const subUnitOutputSets: Dict<Set<string>> = {}

  for (const unitId in unitInputs) {
    const unitInput = unitInputs[unitId]
    subUnitInputSets[unitId] = new Set(unitInput)
  }

  for (const unitId in unitOutputs) {
    const unitOutput = unitOutputs[unitId]
    subUnitOutputSets[unitId] = new Set(unitOutput)
  }

  const mergeTotalCounts: Dict<number> = {}
  const mergeTotalSelectedCounts: Dict<number> = {}

  const unitInputToMerges: Dict<Dict<string>> = {}
  const unitOutputToMerges: Dict<Dict<string>> = {}
  for (const mergeId in spec.merges) {
    mergeTotalCounts[mergeId] = 0
    mergeTotalSelectedCounts[mergeId] = 0
    const merge = spec.merges[mergeId]
    for (const unitId in merge) {
      unitInputToMerges[unitId] = unitInputToMerges[unitId] || {}
      unitOutputToMerges[unitId] = unitOutputToMerges[unitId] || {}
      const mergeUnit = merge[unitId]
      const { input = {}, output = {} } = mergeUnit
      for (const inputId in input) {
        mergeTotalCounts[mergeId]++
        if (subUnitSet.has(unitId)) {
          mergeTotalSelectedCounts[mergeId]++
        }
        unitInputToMerges[unitId][inputId] = mergeId
      }
      for (const outputId in output) {
        mergeTotalCounts[mergeId]++
        if (subUnitSet.has(unitId)) {
          mergeTotalSelectedCounts[mergeId]++
        }
        unitOutputToMerges[unitId][outputId] = mergeId
      }
    }
  }

  for (const unitId in spec.units) {
    const unit = spec.units[unitId]
    if (subUnitSet.has(unitId)) {
      newSpec = assocPath(newSpec, ['units', unitId], unit)
    } else {
      parentSpec = assocPath(parentSpec, ['units', unitId], unit)
    }
  }

  let newSpecSubPinId: { input: Dict<number>; output: Dict<number> } = {
    input: {},
    output: {},
  }

  function suffixId(init: string, obj: Dict<any>): string {
    let id = init
    let i = 0
    while (obj[id]) {
      id = init + i
      i++
    }
    return id
  }

  const unitMergePinRename: Dict<{
    input: Dict<string>
    output: Dict<string>
  }> = {}

  for (const unitId in spec.units) {
    const unit = spec.units[unitId]
    const { id } = unit
    const unitSpec = specs[id]
    const subUnitInputSet = subUnitInputSets[unitId] || new Set()
    const subUnitOutputSet = subUnitOutputSets[unitId] || new Set()
    const unitInputToMerge = unitInputToMerges[unitId] || {}
    const unitOutputToMerge = unitOutputToMerges[unitId] || {}
    const subUnitInputToMerge = subUnitInputToMerges[unitId] || {}
    const subUnitOutputToMerge = subUnitOutputToMerges[unitId] || {}
    const { inputs = {}, outputs = {} } = unitSpec

    unitMergePinRename[unitId] = { input: {}, output: {} }

    function addNewSpecPin(type: IO, unitId: string, pinId: string): string {
      const _pinId = suffixId(pinId, newSpec[`${type}s`] || {})
      const newSpecTypeSubPinId = newSpecSubPinId[type]
      const subPinId = (newSpecTypeSubPinId[_pinId] ?? -1) + 1
      newSpecTypeSubPinId[_pinId] = subPinId
      newSpec = assocPath(newSpec, [`${type}s`, _pinId], {
        pin: { [subPinId]: { unitId, pinId } },
      })
      unitMergePinRename[unitId][type][pinId] = _pinId
      return _pinId
    }

    function addNewSpecInput(unitId: string, pinId: string): string {
      return addNewSpecPin('input', unitId, pinId)
    }

    function addNewSpecOutput(unitId: string, pinId: string): string {
      return addNewSpecPin('output', unitId, pinId)
    }

    for (const inputId in inputs) {
      unitMergePinRename[unitId]['input'][inputId] = inputId
      const inputMergeId = unitInputToMerge[inputId]
      if (inputMergeId) {
        if (subUnitSet.has(unitId)) {
          if (subMergeSet.has(inputMergeId)) {
            const mergeTotalCount = mergeTotalCounts[inputMergeId]
            const mergeTotalSelectedCount =
              mergeTotalSelectedCounts[inputMergeId]
            if (mergeTotalCount === mergeTotalSelectedCount) {
              //
            } else if (mergeTotalSelectedCount === 1) {
              addNewSpecInput(unitId, inputId)
            }
          } else {
            addNewSpecInput(unitId, inputId)
          }
        }
        // if (subMergeSet.has(inputMergeId)) {
        //   if (subUnitSet.has(unitId)) {
        //     addNewSpecOutput(unitId, inputId)
        //   }
        // } else {
        //   if (subUnitSet.has(unitId)) {
        //     addNewSpecInput(unitId, inputId)
        //   }
        // }
      } else {
        if (subUnitInputSet.has(inputId)) {
          //
        } else {
          if (subUnitSet.has(unitId)) {
            addNewSpecInput(unitId, inputId)
          }
        }
      }
    }

    for (const outputId in outputs) {
      unitMergePinRename[unitId]['output'][outputId] = outputId
      const outputMergeId = unitOutputToMerge[outputId]
      if (outputMergeId) {
        if (subUnitSet.has(unitId)) {
          if (subMergeSet.has(outputMergeId)) {
            const mergeTotalCount = mergeTotalCounts[outputMergeId]
            const mergeTotalSelectedCount =
              mergeTotalSelectedCounts[outputMergeId]
            if (mergeTotalCount === mergeTotalSelectedCount) {
              //
            } else if (mergeTotalSelectedCount === 1) {
              addNewSpecOutput(unitId, outputId)
            }
          } else {
            addNewSpecOutput(unitId, outputId)
          }
        }
        // if (subMergeSet.has(outputMergeId)) {
        //   if (subUnitSet.has(unitId)) {
        //     addNewSpecOutput(unitId, outputId)
        //   }
        // } else {
        //   if (subUnitSet.has(unitId)) {
        //     addNewSpecOutput(unitId, outputId)
        //   }
        // }
      } else {
        if (subUnitOutputSet.has(outputId)) {
          //
        } else {
          if (subUnitSet.has(unitId)) {
            addNewSpecOutput(unitId, outputId)
          }
        }
      }
    }
  }

  for (const mergeId in spec.merges) {
    const merge = spec.merges[mergeId]
    if (subMergeSet.has(mergeId)) {
      const mergeTotalCount = mergeTotalCounts[mergeId]
      const mergeTotalSelectedCount = mergeTotalSelectedCounts[mergeId]

      let newMerge: GraphMergeSpec = {}
      let parentMerge: GraphMergeSpec = {}

      for (const unitId in merge) {
        if (subUnitSet.has(unitId)) {
          newMerge[unitId] = merge[unitId]
        } else {
          parentMerge[unitId] = merge[unitId]
        }
      }
      if (mergeTotalSelectedCount > 1) {
        newSpec = assocPath(newSpec, ['merges', mergeId], newMerge)

        if (mergeTotalSelectedCount < mergeTotalCount) {
          parentSpec = assocPath(newSpec, ['merges', mergeId], parentMerge)
        }
      }

      if (mergeTotalSelectedCount === mergeTotalCount) {
        newSpec = assocPath(newSpec, ['merges', mergeId], newMerge)
      }
    } else {
      const _merge: GraphMergeSpec = {}
      for (const unitId in merge) {
        const mergeUnit = merge[unitId]
        const _unitId = subUnitSet.has(unitId) ? newUnitId : unitId
        const { input = {}, output = {} } = mergeUnit
        _merge[_unitId] = {}
        for (const inputId in input) {
          const _inputId = unitMergePinRename[unitId]['input'][inputId]
          _merge[_unitId]['input'] = _merge[_unitId]['input'] || {}
          _merge[_unitId]['input'][_inputId] = true
        }
        for (const outputId in output) {
          const _outputId = unitMergePinRename[unitId]['output'][outputId]
          _merge[_unitId]['output'] = _merge[_unitId]['output'] || {}
          _merge[_unitId]['output'][_outputId] = true
        }
      }

      parentSpec = assocPath(parentSpec, ['merges', mergeId], _merge)
    }
  }

  parentSpec.units = parentSpec.units || {}
  parentSpec.units[newUnitId] = {
    id: newSpecId,
  }

  return [parentSpec, newSpec]
}
