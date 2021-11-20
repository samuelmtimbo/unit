import { Config } from '../../../../../Class/Unit/Config'
import { J } from '../../../../../interface/J'
import { Primitive } from '../../../../../Primitive'

const ALLOWED = new Set([
  'search',
  'hash',
  'host',
  'hostname',
  'hfef',
  'origin',
  'pathname',
  'port',
  'protocol',
])

export interface I {}

export interface O {}

export default class Location extends Primitive<I, O> implements J {
  constructor(config?: Config) {
    super(
      {
        i: [],
        o: [],
      },
      config
    )
  }

  set(name: string, data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  hasKey(name: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  delete(name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  keys(): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  setPath(path: string[], name: string, data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getPath(path: string[], name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  deletePath(path: string[], name: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async get(name: string): Promise<string> {
    if (ALLOWED.has(name)) {
      return location[name]
    } else {
      throw new Error('cannot get property')
    }
  }
}
