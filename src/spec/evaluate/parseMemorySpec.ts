import { Memory } from '../../Class/Unit/Memory'
import { Classes, Specs } from '../../types'
import { clone } from '../../util/object'
import { evaluateMemorySpec } from './evaluateMemorySpec'

export function parseMemorySpec(
  memory: Memory,
  specs: Specs,
  classes: Classes
): Memory {
  const memoryClone = clone(memory)

  evaluateMemorySpec(memoryClone, specs, classes)

  return memoryClone
}
