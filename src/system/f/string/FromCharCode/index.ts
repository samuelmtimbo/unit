import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'

export interface I<T> {
  code: number
}

export interface O<T> {
  char: string
}

export default class FromCharCode<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['code'],
      o: ['char'],
    })
  }

  f({ code }: I<T>, done: Done<O<T>>): void {
    const char = String.fromCharCode(code)
    done({ char })
  }
}
