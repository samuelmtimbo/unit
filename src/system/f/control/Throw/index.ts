import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  message: string
}

export default class Throw extends Functional<I, {}> {
  constructor(config?: Config) {
    super(
      {
        i: ['message'],
      },
      config
    )
  }

  f({ message }: I, done: Done<{}>): void {
    done(undefined, message)
  }
}
