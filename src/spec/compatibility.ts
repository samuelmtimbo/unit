import { Specs } from '../types'
import { isTypeMatch } from './parser'
import { getSpecTypeInterfaceByPath, TypeInterface } from './type'

export function compatibleInterface(
  a: string,
  b: string,
  specs: Specs
): boolean {
  const aSpec = specs[a]
  const bSpec = specs[b]

  const { inputs: aI, outputs: aO } = aSpec
  const { inputs: bI, outputs: bO } = bSpec

  const aInputNames = Object.keys(aI)
  const aOutputNames = Object.keys(aO)

  const bInputNames = Object.keys(bI)
  const bOutputNames = Object.keys(bO)

  if (
    aInputNames.length !== bInputNames.length ||
    aOutputNames.length !== bOutputNames.length
  ) {
    return false
  }

  const aTypeInterface: TypeInterface = getSpecTypeInterfaceByPath(a, specs)
  const bTypeInterface: TypeInterface = getSpecTypeInterfaceByPath(b, specs)

  const aITypes = aInputNames.map((pinId) => aTypeInterface.input[pinId])
  const aOTypes = aOutputNames.map((pinId) => aTypeInterface.output[pinId])
  const bITypes = bInputNames.map((pinId) => bTypeInterface.input[pinId])
  const bOTypes = bOutputNames.map((pinId) => bTypeInterface.output[pinId])

  for (let i = 0; i < aITypes.length; i++) {
    const aIType = aITypes[i]
    const bIType = bITypes[i]
    const aOType = aOTypes[i]
    const bOType = bOTypes[i]

    if (!isTypeMatch(aIType, bIType) || !isTypeMatch(aOType, bOType)) {
      return false
    }
  }

  return true
}
