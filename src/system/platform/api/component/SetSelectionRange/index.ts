import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Component } from '../../../../../client/component'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { SEL, SelectionObject } from '../../../../../types/interface/SEL'
import { ID_SET_SELECTION_RANGE } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export type I = {
  component: Component_ & SEL
  opt: SelectionObject
}

export type O = {
  done: any
}

export default class SetSelectionRange extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['component', 'opt'],
        fo: [],
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
      ID_SET_SELECTION_RANGE
    )
  }

  async f({ component, opt }: I, done: Done<O>) {
    const globalId = component.getGlobalId()

    const component_ = (await firstGlobalComponentPromise(
      this.__system,
      globalId
    )) as Component

    const leaf = component_.getFirstRootLeaf()

    leaf.setSelectionRange(opt.start, opt.end, opt.direction)

    done({})
  }

  b() {
    this._output.done.push(true)
  }
}
