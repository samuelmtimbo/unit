import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'

export type I = {
  src: Unit
  users: string[]
}

export type O = {}

export default class Auth extends Unit<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['src', 'users'],
        o: [],
      },
      config
    )
  }
}
