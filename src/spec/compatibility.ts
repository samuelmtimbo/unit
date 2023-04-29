import { System } from '../system'
import { keys } from '../system/f/object/Keys/f'
import { isTypeMatch } from './parser'
import { getSpecTypeInterfaceById, TypeInterface } from './type'

export function compatibleInterface(
  system: System,
  a: string,
  b: string
): boolean {
  const { specs } = system

  const aSpec = specs[a]
  const bSpec = specs[b]

  const { inputs: aI, outputs: aO } = aSpec
  const { inputs: bI, outputs: bO } = bSpec

  const aInputNames = keys(aI)
  const aOutputNames = keys(aO)

  const bInputNames = keys(bI)
  const bOutputNames = keys(bO)

  if (
    aInputNames.length !== bInputNames.length ||
    aOutputNames.length !== bOutputNames.length
  ) {
    return false
  }

  const aTypeInterface: TypeInterface = getSpecTypeInterfaceById(a, specs)
  const bTypeInterface: TypeInterface = getSpecTypeInterfaceById(b, specs)

  const aITypes = aInputNames.map((pinId) => aTypeInterface.input[pinId])
  const aOTypes = aOutputNames.map((pinId) => aTypeInterface.output[pinId])
  const bITypes = bInputNames.map((pinId) => bTypeInterface.input[pinId])
  const bOTypes = bOutputNames.map((pinId) => bTypeInterface.output[pinId])

  for (let i = 0; i < aITypes.length; i++) {
    const aIType = aITypes[i]
    const bIType = bITypes[i]
    const aOType = aOTypes[i]
    const bOType = bOTypes[i]

    if (
      !isTypeMatch(system, aIType, bIType) ||
      !isTypeMatch(system, aOType, bOType)
    ) {
      return false
    }
  }

  return true
}
