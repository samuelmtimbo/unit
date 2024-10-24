import { Classes, Specs } from '../../types'
import { Dict } from '../../types/Dict'
import { evaluateDataObj } from './evaluateDataObj'

export function evaluateMemorySpec(
  memory: {
    input: Dict<any>
    output: Dict<any>
    memory: Dict<any>
  },
  specs: Specs,
  classes: Classes,
  resolver: (url: string) => any = () => {
    return undefined
  }
) {
  for (const inputId in memory.input) {
    const input = memory.input[inputId]

    memory.input[inputId] = evaluateDataObj(input, specs, classes, resolver)
  }

  for (const outputId in memory.output) {
    const output = memory.output[outputId]

    memory.output[outputId] = evaluateDataObj(output, specs, classes, resolver)
  }

  memory.memory = evaluateDataObj(memory.memory, specs, classes, resolver)
}
