import { InterceptOpt, ServerHandler } from '../../API'
import { Graph } from '../../Class/Graph'
import { BundleSpec } from '../BundleSpec'
import { Unlisten } from '../Unlisten'
import { EE } from './EE'

export interface S extends EE {
  start(bundle: BundleSpec): Graph
  intercept(opt: InterceptOpt, handler: ServerHandler): Unlisten
}
