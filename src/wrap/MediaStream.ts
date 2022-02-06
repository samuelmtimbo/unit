import { $ } from '../Class/$'
import { ST } from '../interface/ST'
import { NOOP } from '../NOOP'
import { Callback } from '../types/Callback'
import { Unlisten } from '../types/Unlisten'

export function wrapMediaStream(mediaStream: MediaStream): ST {
  const stream = new (class Stream extends $ implements ST {
    __: string[] = ['ST']

    stream(callback: Callback<MediaStream>): Unlisten {
      callback(mediaStream)
      return NOOP
    }
  })(this.__system, this.__pod)

  return stream
}
