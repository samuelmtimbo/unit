import { EventEmitter2 } from 'eventemitter2'
import { emitter as _emitter } from '..'

export const emitter = new EventEmitter2()

export * from './peer'

_emitter.addListener('server', (_data, peer, ws) => {
  const { type, data } = _data
  emitter.emit(type, data, peer, ws)
})
