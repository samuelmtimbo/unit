import { Classes, Specs } from '../../types'
import { GraphUnitPinsSpec } from '../../types/GraphUnitPinsSpec'
import { evaluate } from '../evaluate'

export function evaluateGraphUnitPinSpecData(
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
