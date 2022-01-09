export type IFileHandler = {
  getFile(): File
  createWritable(): WritableStream
}
