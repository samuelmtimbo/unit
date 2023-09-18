export interface AC {
  get(): AudioContext
  getDestination(): AudioDestinationNode
  createOscilator(opt: OscillatorOptions): OscillatorNode
  createAnalyser(opt: AnalyserOptions): AnalyserNode
}
