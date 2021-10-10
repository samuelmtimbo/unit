import { Callback } from '../../../../../Callback'
import { Config } from '../../../../../Class/Unit/Config'
import { Primitive } from '../../../../../Primitive'

const ALLOWED = new Set([
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

export default class Location extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: [],
        o: [],
      },
      config
    )
  }

  get({ name }: { name: string }, callback: Callback): void {
    if (ALLOWED.has(name)) {
      callback(location[name])
    } else {
      callback(undefined, 'cannot get property')
    }
  }
}
