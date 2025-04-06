import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Component } from '../../../../../client/component'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { SEL, SelectionObject } from '../../../../../types/interface/SEL'
import { ID_GET_SELECTION } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export type I = {
  component: Component_ & SEL
  any: any
}

export type O = {
  selection: SelectionObject[]
  done: any
}

export default class GetSelection extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['component', 'any'],
        fo: ['selection'],
        i: [],
        o: ['done'],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_GET_SELECTION
    )
  }

  async f({ component, any: opt }: I, done: Done<O>) {
    const globalId = component.getGlobalId()

    const component_ = (await firstGlobalComponentPromise(
      this.__system,
      globalId
    )) as Component

    const leaf = component_.getFirstRootLeaf()

    const selection = leaf.getSelection()

    done({ selection })
  }

  b() {
    this._output.done.push(true)
  }
}
