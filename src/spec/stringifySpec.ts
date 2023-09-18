import { Memory } from '../Class/Unit/Memory'
import { BundleSpec } from '../types/BundleSpec'
import { GraphSpec } from '../types/GraphSpec'
import { GraphUnitPinsSpec } from '../types/GraphUnitPinsSpec'
import { GraphUnitSpec } from '../types/GraphUnitSpec'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { stringifyDataObj } from '../types/stringifyPinData'
import { stringify } from './stringify'

export const stringifyBundleSpec = (spec: UnitBundleSpec): void => {
  const { unit, specs } = spec

  stringifyGraphUnitSpecData(unit)
}

export function stringifyBundleSpecData(bundle: BundleSpec): void {
  const { spec } = bundle

  stringifyGraphSpecData(spec)
}

export function stringifyUnitBundleSpecData(unitBundle: UnitBundleSpec): void {
  stringifyGraphUnitSpecData(unitBundle.unit)
}

export function stringifyGraphSpecData(spec: GraphSpec): void {
  for (const unitId in spec.units) {
    stringifyGraphUnitSpecData(spec.units[unitId])
  }
}

export function stringifyGraphUnitSpecData(unit: GraphUnitSpec): void {
  const { memory } = unit

  if (memory) {
    stringifyMemorySpecData(memory)
  }
}

export function stringifyMemorySpecData(memory: Memory) {
  for (const inputId in memory.input) {
    const input = memory.input[inputId]

    memory.input[inputId] = stringifyDataObj(input)
  }

  for (const outputId in memory.output) {
    const output = memory.output[outputId]

    memory.output[outputId] = stringifyDataObj(output)
  }

  memory.memory = stringifyDataObj(memory.memory)
}

function stringifyGraphUnitPinSpecData(input: GraphUnitPinsSpec) {
  for (const inputId in input) {
    const { data } = input[inputId]

    if (data !== undefined) {
      input[inputId].data = stringify(data)
    }
  }
}
