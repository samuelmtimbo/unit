export interface AAN {
  getFFTSize: () => number
  getByteTimeDomainData(dataArray: Uint8Array): void
  getByteFrequencyData(dataArray: Uint8Array): void
}
