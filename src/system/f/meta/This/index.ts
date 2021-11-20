import { $ } from '../../../../Class/$'
import { Unit } from '../../../../Class/Unit'
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

  constructor() {
    super({
      i: [],
      o: ['graph'],
    })

    this.addListener('parent', (parent: $ | null) => {
      if (parent === null) {
        if (this._unlisten) {
          this._unlisten()
          this._unlisten = undefined
        }

        this._output.graph.pull()
      } else {
        const { __global_id } = this
        const { __global_id: __parent_global_id } = parent

        const _setup_parent_component = (component) => {
          pushGlobalComponent(this.__system, __global_id, component)
        }

        const parentComponent = getGlobalComponent(this.__system, __parent_global_id)
        if (parentComponent) {
          _setup_parent_component(parentComponent)
        }

        this._unlisten = listenGlobalComponent(
          this.__system,
          __parent_global_id,
          _setup_parent_component
        )

        this._output.graph.push(parent)
      }
    })
  }
}
