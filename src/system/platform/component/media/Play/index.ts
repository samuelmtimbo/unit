import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ME } from '../../../../../types/interface/ME'
import { ID_PLAY_0 } from '../../../../_ids'

export interface I<T> {
  media: ME
  any: {}
}

export interface O<T> {}

export default class Play<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['media', 'any'],
        o: [],
      },
      {
        input: {
          media: {
            ref: true,
          },
        },
      },
      system,
      ID_PLAY_0
    )
  }

  f({ media }: I<T>, done: Done<O<T>>): void {
    media.mediaPlay()

    done()
  }
}
