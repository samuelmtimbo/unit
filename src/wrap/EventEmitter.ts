import { $ } from '../Class/$'
import { System } from '../system'
import { EE } from '../types/interface/EE'

export function wrapEventEmitter(system: System): EE<any> {
  const emitter = new (class Emitter extends $<any> {
    __ = ['EE']
  })(system)

  return emitter
}
