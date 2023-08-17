import { GraphConnectUnitDataOpt } from './GraphConnectUnitDataOpt'
import { GraphUnitMerges } from './GraphUnitMerges'
import { GraphUnitPlugs } from './GraphUnitPlugs'

export type GraphUnitConnect = {
  merges?: GraphUnitMerges
  plugs?: GraphUnitPlugs
  data?: GraphConnectUnitDataOpt
}
