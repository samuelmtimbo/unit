import { EXEC, INIT } from '../constant/STRING'
import { RemoteRef } from './RemoteRef'

export function init<T>(reset: (data: T) => RemoteRef): void {
  let _init: boolean = false
  let _ref: RemoteRef

  onmessage = function (event: MessageEvent) {
    const { data } = event

    const { type, data: _data } = data

    switch (type) {
      case INIT:
        _init = true
        _ref = reset(_data)
        break
      case EXEC:
        if (!_init) {
          throw new Error('Ref was not initialized')
        }
        _ref.exec(_data)
        break
      default:
        throw new Error('Invalid message type')
    }
  }
}
