export type FileHandler = {
  getFile(): File
  createWritable(): WritableStream
}
