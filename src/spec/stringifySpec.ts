import { Memory } from '../Class/Unit'
import { Classes, GraphUnitPinsSpec, GraphUnitSpec, Specs } from '../types'
import { GraphSpec } from '../types/GraphSpec'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { evaluateDataObj, stringifyDataObj } from '../types/stringifyPinData'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { evaluate } from './evaluate'
import { stringify } from './stringify'
import { clone } from '../util/object'

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
  const { memory, input } = unit

  if (input) {
    // stringifyGraphUnitPinSpecData(input)
  }

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

export function evaluateGraphUnitSpecData(
  unit: GraphUnitSpec,
  specs: Specs,
  classes: Classes
): void {
  const { memory, input } = unit

  if (input) {
    evaluateGraphUnitPinSpec(input, specs, classes)
  }

  if (memory) {
    evaluateMemorySpec(memory, specs, classes)
  }
}

function evaluateGraphUnitPinSpec(
  input: GraphUnitPinsSpec,
  specs: Specs,
  classes: Classes
) {
  for (const inputId in input) {
    const { data } = input[inputId]

    if (data !== undefined) {
      input[inputId].data = evaluate(data, specs, classes)
    }
  }
}

export function evaluateMemorySpec(
  memory: {
    input: Dict<any>
    output: Dict<any>
    memory: Dict<any>
  },
  specs: Specs,
  classes: Classes
) {
  for (const inputId in memory.input) {
    const input = memory.input[inputId]

    memory.input[inputId] = evaluateDataObj(input, specs, classes)
  }

  for (const outputId in memory.output) {
    const output = memory.output[outputId]

    memory.output[outputId] = evaluateDataObj(output, specs, classes)
  }

  memory.memory = evaluateDataObj(memory.memory, specs, classes)
}

export function parseMemorySpec(
  memory: {
    input: Dict<any>
    output: Dict<any>
    memory: Dict<any>
  },
  specs: Specs,
  classes: Classes
) {
  const memoryClone = clone(memory)

  evaluateMemorySpec(memoryClone, specs, classes)

  return memoryClone
}

export const stringifyBundleSpec = (spec: UnitBundleSpec): void => {
  const { unit, specs } = spec

  stringifyGraphUnitSpecData(unit)
}
