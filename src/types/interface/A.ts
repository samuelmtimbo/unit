export interface A {
  append(a: any): Promise<void>
  put(i: number, data: any): Promise<void>
  at(i: number): Promise<any>
  length(): Promise<number>
  indexOf(a: any): Promise<number>
}
