import { InterceptOpt, ServerHandler } from '../../API'
import { Graph } from '../../Class/Graph'
import { BundleSpec } from '../BundleSpec'
import { Unlisten } from '../Unlisten'

export interface S {
  start(bundle: BundleSpec): Graph
  intercept(opt: InterceptOpt, handler: ServerHandler): Unlisten
}
