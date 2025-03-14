import { Memory } from '../Class/Unit/Memory'
import { BundleSpec } from '../types/BundleSpec'
import { GraphSpec } from '../types/GraphSpec'
import { GraphSpecs } from '../types/GraphSpecs'
import { GraphUnitSpec } from '../types/GraphUnitSpec'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { stringifyDataObj } from '../types/stringifyPinData'

export const stringifyBundleSpec = (bundle: UnitBundleSpec): void => {
  const { unit, specs } = bundle

  stringifyGraphUnitSpecData(unit)
}

export const stringifySpecs = (specs: GraphSpecs): void => {
  for (const specId in specs) {
    const spec = specs[specId]

    stringifyGraphSpecData(spec)
  }
}

export function stringifyBundleSpecData(bundle: BundleSpec): void {
  const { spec } = bundle

  stringifyGraphSpecData(spec)
}

export function stringifyUnitBundleSpecData(bundle: UnitBundleSpec): void {
  stringifyGraphUnitSpecData(bundle.unit)

  if (bundle.specs) {
    stringifySpecs(bundle.specs)
  }
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
