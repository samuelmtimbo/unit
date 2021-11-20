import { Element } from '../../../../Class/Element/Element'
import { System } from '../../../../system'

export interface I {
  style: object
}

export interface O {}

export default class Zoom extends Element<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style'],
        o: [],
      },
      {},
      system
    )
  }
}
