import { proxyWrap } from '../proxyWrap'
import { Dict } from '../types/Dict'
import { $EE } from '../types/interface/async/$EE'
import { Async } from '../types/interface/async/Async'
import { EE } from '../types/interface/EE'

export function $refEmitter(
  emitter: EE,
  wrapper: Dict<(unit: any) => any>
): $EE {
  const _emitter = emitter

  const $_emitter = Async(_emitter, ['EE'], wrapper)

  return proxyWrap($_emitter, ['EE'])
}
