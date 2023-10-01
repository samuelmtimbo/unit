import { $ } from '../Class/$'
import { System } from '../system'
import { MST } from '../types/interface/MST'

export function wrapMediaStreamTrack(
  mediaStreamTrack: MediaStreamTrack,
  system: System
): MST {
  const stream = new (class MediaStreamTrack_ extends $ implements MST {
    __: string[] = ['MST']

    async mediaStreamTrack() {
      return mediaStreamTrack
    }
  })(system)

  return stream
}
