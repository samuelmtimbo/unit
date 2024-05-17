export interface AC {
  get(): AudioContext
  disconnect(audioNode?: AudioNode): void
  getDestination(): AudioDestinationNode
  createOscilator(opt: OscillatorOptions): OscillatorNode
  createAnalyser(opt: AnalyserOptions): AnalyserNode
}
