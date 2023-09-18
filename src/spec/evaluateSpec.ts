import { Classes, Specs } from '../types'
import { Dict } from '../types/Dict'
import { GraphUnitPinsSpec } from '../types/GraphUnitPinsSpec'
import { GraphUnitSpec } from '../types/GraphUnitSpec'
import { clone } from '../util/object'
import { evaluate } from './evaluate'

export function evaluateDataObj(
  obj: Dict<any>,
  specs: Specs,
  classes: Classes
): Dict<any> {
  const _obj = {}

  for (const name in obj) {
    const data = obj[name]

    if (data !== undefined) {
      _obj[name] = evaluate(data, specs, classes)
    }
  }

  return _obj
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
