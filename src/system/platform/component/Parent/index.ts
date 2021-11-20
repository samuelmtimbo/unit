import { Element } from '../../../../Class/Element/Element'

export interface I {}

export interface O {}

export default class Parent extends Element<I, O> {
  constructor() {
    super({
      i: [],
      o: [],
    })
  }
}
