import { $ } from './Class/$'
import { System } from './system'
import { randomIdNotIn } from './util/id'

export function getGlobalRef(system: System, id: string): $ {
  const {
    global: { ref },
  } = system

  return ref[id] || null
}

export function setGlobalRef(system: System, unit: any): string {
  const {
    global: { ref },
  } = system

  const id = randomIdNotIn(ref)

  ref[id] = unit

  return id
}

export function deleteGlobalRef(system: System, id: string): void {
  const {
    global: { ref },
  } = system

  delete ref[id]
}
