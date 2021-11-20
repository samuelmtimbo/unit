import { Config } from '../../../../../Class/Unit/Config'
import { Primitive } from '../../../../../Primitive'

export type I = {}

export type O = {}

// TODO

export default class CloudStorage extends Primitive<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: [],
        o: [],
      },
      config
    )
  }

  $setItem(
    { key, data }: { key: string; data: any },
    callback: () => void
  ): void {
    callback()
  }

  $getItem<T>({ key }: { key: string }, callback: (data: any) => void): void {
    callback('foo')
  }
}
