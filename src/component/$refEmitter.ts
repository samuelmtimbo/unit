import { proxyWrap } from '../proxyWrap'
import { $EE } from '../types/interface/async/$EE'
import { Async } from '../types/interface/async/Async'
import { EE } from '../types/interface/EE'

export function $refEmitter(emitter: EE): $EE {
  const _emitter = emitter

  const $_emitter = Async(_emitter, ['EE'])

  return proxyWrap($_emitter, ['EE'])
}
