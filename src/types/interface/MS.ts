export interface MS {
  mediaStream(): Promise<MediaStream>
  getVideoTracks(): Promise<MediaStreamTrack[]>
}
