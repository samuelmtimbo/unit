export function stopMediaStream(mediaStream: MediaStream): void {
  mediaStream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
}
