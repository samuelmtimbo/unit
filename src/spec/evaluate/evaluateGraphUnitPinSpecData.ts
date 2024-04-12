import { Classes, Specs } from '../../types'
import { GraphUnitPinsSpec } from '../../types/GraphUnitPinsSpec'
import { evaluateDataValue } from '../evaluateDataValue'

export function evaluateGraphUnitPinSpecData(
  input: GraphUnitPinsSpec,
  specs: Specs,
  classes: Classes
) {
  for (const inputId in input) {
    const { data } = input[inputId]

    if (data !== undefined) {
      const dataRef = evaluateDataValue(data, specs, classes)

      input[inputId].data = dataRef.data
    }
  }
}
