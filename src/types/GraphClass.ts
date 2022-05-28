import { Graph } from '../Class/Graph'
import { Dict } from './Dict'
import { UnitBundle } from './UnitBundle'
import { UnitClass } from './UnitClass'

export interface GraphBundle<I = any, O = any>
  extends UnitBundle<Graph<I, O>> {}

export interface GraphClass<
  I extends Dict<any> = any,
  O extends Dict<any> = any
> extends UnitClass<Graph<I, O>> {}
