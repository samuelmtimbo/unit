import { GraphSpec } from '../types'
import { stringifyDataObj } from '../types/stringifyPinData'

export function _stringifyGraphSpecData(spec: GraphSpec): void {
  for (const unitId in spec.units) {
    const unit = spec.units[unitId]

    const { memory } = unit

    if (memory) {
      for (const inputId in memory.input) {
        const input = memory.input[inputId]

        memory.input[inputId] = stringifyDataObj(input)
      }

      for (const outputId in memory.output) {
        const output = memory.output[outputId]

        memory.output[outputId] = stringifyDataObj(output)
      }

      for (const stateId in memory.memory) {
        const state = memory.memory[stateId]

        memory.memory[stateId] = stringifyDataObj(state)
      }
    }
  }
}
