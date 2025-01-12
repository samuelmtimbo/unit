export interface BO {
  json(): Promise<any>
  text(): Promise<string>
  blob(): Promise<Blob>
}
