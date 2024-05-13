import { Functional } from '../../../../Class/Functional'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_ICONS } from '../../../_ids'

export interface I<T> {
  any: number
}

export interface O<T> {
  icons: Dict<string>
}

export default class Icons<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['any'],
        o: ['icons'],
      },
      {},
      system,
      ID_ICONS
    )
  }

  f({ any }: I<T>, done): void {
    const { icons } = this.__system

    done({ icons })
  }
}
