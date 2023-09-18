import { Callback } from '../Callback'

export interface MS {
  mediaStream(callback: Callback<MediaStream>): void
  getVideoTracks(): Promise<MediaStreamTrack[]>
}
