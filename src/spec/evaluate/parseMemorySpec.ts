import { Memory } from '../../Class/Unit/Memory'
import { Classes, Specs } from '../../types'
import { clone } from '../../util/clone'
import { evaluateMemorySpec } from './evaluateMemorySpec'

export function parseMemorySpec(
  memory: Memory,
  specs: Specs,
  classes: Classes,
  resolver: (url: string) => any = () => {
    return undefined
  }
): Memory {
  const memoryClone = clone(memory)

  evaluateMemorySpec(memoryClone, specs, classes, resolver)

  return memoryClone
}
