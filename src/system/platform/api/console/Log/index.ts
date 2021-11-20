import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export interface I<T> {
  message: string
}

export interface O<T> {}

export default class Log<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['message'],
      o: [],
    })
  }

  f({ message }: I<T>, done: Done<O<T>>): void {
    console.log(message)
    done({})
  }
}
