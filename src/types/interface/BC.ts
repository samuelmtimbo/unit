export interface BC {
  readValue(): Promise<string>
  writeValue(data: string): Promise<void>
}
