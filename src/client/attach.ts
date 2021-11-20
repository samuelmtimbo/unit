import { System } from '../system'
import { Attachable } from './Attachable'

export function attach(attachable: Attachable, system: System): void {
  attachable.attach(system)
}
