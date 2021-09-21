import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export interface I<T> {
  message: string
}

export interface O<T> {}

export default class Log<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['message'],
        o: [],
      },
      config
    )
  }

  f({ message }: I<T>, done: Done<O<T>>): void {
    console.log(message)
    done({})
  }
}
