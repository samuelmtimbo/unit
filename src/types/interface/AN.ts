export interface AN {
  connect(audioNode: AudioNode): void
  disconnect(audioNode?: AudioNode): void
  getContext(): AudioContext
}
