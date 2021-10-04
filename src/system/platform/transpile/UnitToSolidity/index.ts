import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export type I = {
  any: any
}

export type O = {
  position: {
    latitude: number
    longitude: number
  }
}

export default class SpecToSolidity extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['unit'],
        o: ['sol'],
      },
      config
    )
  }

  f({ any }: I, done: Done<O>) {}
}
