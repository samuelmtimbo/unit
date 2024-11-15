import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Component } from '../../../../../client/component'
import { Rect } from '../../../../../client/util/geometry/types'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_GET_CLIENT_BOUNDING_RECT } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export type I = {
  component: Component_
  any: any
}

export type O = {
  rect: Rect
}

export default class GetClientBoundingRect extends Functional<I, O> {
  private _observer: ResizeObserver

  constructor(system: System) {
    super(
      {
        i: ['component', 'any'],
        o: ['rect'],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_GET_CLIENT_BOUNDING_RECT
    )
  }

  async f({ component, any: opt }: I, done: Done<O>) {
    const {
      api: {
        document: { ResizeObserver },
      },
    } = this.__system

    const globalId = component.getGlobalId()

    const component_ = (await firstGlobalComponentPromise(
      this.__system,
      globalId
    )) as Component

    const rect = component_.getBoundingClientRect()

    done({ rect })
  }
}
