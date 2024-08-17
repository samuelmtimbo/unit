import { $ } from '../Class/$'
import { System } from '../system'
import { MS } from '../types/interface/MS'

export function wrapMediaStream(
  mediaStream: MediaStream,
  system: System
): MS & $ {
  const stream = new (class Stream extends $ implements MS {
    __: string[] = ['MS']

    async mediaStream() {
      return mediaStream
    }

    async getVideoTracks(): Promise<MediaStreamTrack[]> {
      return mediaStream.getVideoTracks()
    }
  })(system)

  return stream
}
