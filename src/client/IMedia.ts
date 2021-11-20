export default interface IMedia {
  captureStream(
    { frameRate }: { frameRate: number },
    callback: (data: MediaStream | null) => void
  ): void
}
