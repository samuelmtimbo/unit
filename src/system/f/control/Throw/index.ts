import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'

export interface I {
  message: string
}

export default class Throw extends Functional<I, {}> {
  constructor() {
    super({
      i: ['message'],
    })
  }

  f({ message }: I, done: Done<{}>): void {
    done(undefined, message)
  }
}
