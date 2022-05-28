export interface V<T = any> {
  read(): Promise<T>
  write(data: T): Promise<void>
}
