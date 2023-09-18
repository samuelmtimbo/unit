import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { Component_ } from '../../../../types/interface/Component'
import { ID_RENDER } from '../../../_ids'

export interface I {
  component: Component_
  className: string
  style: object
}

export interface O {}

export default class Render extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'component'],
        o: [],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_RENDER
    )
  }
}
