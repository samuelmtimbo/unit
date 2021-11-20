import { $ } from '../../../../Class/$'
import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import {
  getGlobalComponent,
  listenGlobalComponent,
  pushGlobalComponent,
} from '../../../../client/globalComponent'
import { Unlisten } from '../../../../Unlisten'

export interface I<T> {}

export interface O<T> {
  graph: $
}

export interface R<T> {}

export default class This<T> extends Unit<I<T>, O<T>> {
  private _unlisten: Unlisten

  constructor(config?: Config) {
    super(
      {
        i: [],
        o: ['graph'],
      },
      config
    )

    this.addListener('parent', (parent: $ | null) => {
      if (parent === null) {
        if (this._unlisten) {
          this._unlisten()
          this._unlisten = undefined
        }

        this._output.graph.pull()
      } else {
        const { globalId } = this

        const { globalId: parentGlobalId } = parent

        const _setup_parent_component = (component) => {
          pushGlobalComponent(globalId, component)
        }

        const parentComponent = getGlobalComponent(parentGlobalId)
        if (parentComponent) {
          _setup_parent_component(parentComponent)
        }

        this._unlisten = listenGlobalComponent(
          parentGlobalId,
          _setup_parent_component
        )

        this._output.graph.push(parent)
      }
    })
  }
}
