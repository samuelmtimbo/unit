import { emitter as _emitter } from '..'
import { EventEmitter_ } from '../../../EventEmitter'

export const emitter = new EventEmitter_()

export * from './peer'

_emitter.addListener('server', (_data, peer, ws) => {
  const { type, data } = _data
  emitter.emit(type, data, peer, ws)
})
