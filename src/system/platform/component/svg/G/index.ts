import { Element } from '../../../../../Class/Element/Element'

export interface I {}

export interface O {}

export default class SVGG extends Element<I, O> {
  constructor() {
    super({
      i: ['class', 'style'],
      o: [],
    })
  }
}
