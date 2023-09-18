import { $ } from '../Class/$'
import { NOOP } from '../NOOP'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { MS } from '../types/interface/MS'
import { Unlisten } from '../types/Unlisten'

export function wrapMediaStream(mediaStream: MediaStream, system: System): MS {
  const stream = new (class Stream extends $ implements MS {
    __: string[] = ['MS']

    get(callback: Callback<MediaStream>): Unlisten {
      callback(mediaStream)

      return NOOP
    }
  })(system)

  return stream
}
