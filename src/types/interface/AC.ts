export interface AC {
  audioContext(): AudioContext
  disconnect(audioNode?: AudioNode): void
  getDestination(): AudioDestinationNode
  createOscillator(opt: OscillatorOptions): OscillatorNode
  createAnalyser(opt: AnalyserOptions): AnalyserNode
  createBufferSource(): AudioBufferSourceNode
  decodeAudioData(buffer: ArrayBuffer): Promise<AudioBuffer>
}
