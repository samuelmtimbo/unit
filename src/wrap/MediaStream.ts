import { $ } from '../Class/$'
import { NOOP } from '../NOOP'
import { Pod } from '../pod'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { ST } from '../types/interface/ST'
import { Unlisten } from '../types/Unlisten'

export function wrapMediaStream(
  mediaStream: MediaStream,
  system: System,
  pod: Pod
): ST {
  const stream = new (class Stream extends $ implements ST {
    __: string[] = ['ST']

    stream(callback: Callback<MediaStream>): Unlisten {
      callback(mediaStream)

      return NOOP
    }
  })(system, pod)

  return stream
}
