import { Dict } from '../types/Dict'
import { GraphUnitSpec } from '../types/GraphUnitSpec'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { remapSpecs } from './remapBundle'

export const remapUnitSpec = (unit: GraphUnitSpec, specIdMap: Dict<string>) => {
  unit.id = specIdMap[unit.id] ?? unit.id
}

export const remapUnitBundle = (
  bundle: UnitBundleSpec,
  specIdMap: Dict<string>
) => {
  remapUnitSpec(bundle.unit, specIdMap)
  remapSpecs(bundle, specIdMap)
}
