import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  value: any
  style: object
}

export interface O {}

export default class Datum extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'value'],
        o: [],
      },
      config
    )
  }
}
