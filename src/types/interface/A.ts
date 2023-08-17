export interface A<T = any> {
  append(a: T): Promise<void>
  put(i: number, data: any): Promise<void>
  at(i: number): Promise<any>
  length(): Promise<number>
  indexOf(a: T): Promise<number>
}
