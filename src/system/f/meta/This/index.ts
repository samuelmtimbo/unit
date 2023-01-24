import { $ } from '../../../../Class/$'
import { Unit } from '../../../../Class/Unit'
import { System } from '../../../../system'
import { Unlisten } from '../../../../types/Unlisten'
import { ID_THIS } from '../../../_ids'

export interface I<T> {}

export interface O<T> {
  graph: $
}

export interface R<T> {}

export default class This<T> extends Unit<I<T>, O<T>> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        i: [],
        o: ['graph'],
      },
      {},
      system,
      ID_THIS
    )

    this.addListener('parent', (parent: Unit | null) => {
      if (parent === null) {
        if (this._unlisten) {
          this._unlisten()
          this._unlisten = undefined
        }

        this._output.graph.pull()
      } else {
        this._output.graph.push(parent)
      }
    })
  }
}
