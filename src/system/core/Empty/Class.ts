import { Functional } from '../../../Class/Functional'
import { Config } from '../../../Class/Unit/Config'

export type I = {}

export type O = {}

export default class Empty extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: [],
        o: [],
      },
      config
    )
  }

  f() {}
}
