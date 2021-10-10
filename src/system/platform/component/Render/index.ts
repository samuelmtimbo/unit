import { $Graph } from '../../../../async/$Graph'
import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  pod: $Graph
  className: string
  style: object
}

export interface O {}

export default class Render extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'className', 'pod'],
        o: [],
      },
      config,
      {
        input: {
          pod: {
            ref: true,
          },
        },
      }
    )
  }
}
