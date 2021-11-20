import { Primitive } from '../../../../../Primitive'

export type I = {}

export type O = {}

// TODO

export default class CloudStorage extends Primitive<I, O> {
  constructor() {
    super({
      i: [],
      o: [],
    })
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
