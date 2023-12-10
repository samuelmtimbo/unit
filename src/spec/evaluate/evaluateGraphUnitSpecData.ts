import { Classes, Specs } from '../../types'
import { GraphUnitSpec } from '../../types/GraphUnitSpec'
import { evaluateGraphUnitPinSpecData } from './evaluateGraphUnitPinSpecData'
import { evaluateMemorySpec } from './evaluateMemorySpec'

export function evaluateGraphUnitSpecData(
  unit: GraphUnitSpec,
  specs: Specs,
  classes: Classes
): void {
  const { memory, input } = unit

  if (input) {
    evaluateGraphUnitPinSpecData(input, specs, classes)
  }

  if (memory) {
    evaluateMemorySpec(memory, specs, classes)
  }
}
