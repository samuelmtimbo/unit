import { emitter as _emitter } from '..'
import { EventEmitter } from '../../../EventEmitter'

export const emitter = new EventEmitter()

export * from './peer'

_emitter.addListener('server', (_data, peer, ws) => {
  const { type, data } = _data
  emitter.emit(type, data, peer, ws)
})
