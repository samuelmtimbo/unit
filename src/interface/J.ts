export interface J {
  get(name: string): Promise<any>

  set(name: string, data: any): Promise<void>

  hasKey(name: string): Promise<boolean>

  delete(name: string): Promise<any>

  keys(): Promise<string[]>

  setPath(path: string[], name: string, data: any): Promise<void>

  getPath(path: string[], name: string): Promise<any>

  deletePath(path: string[], name: string): Promise<void>
}
