import { mapObjKey } from '../util/object'
import { GRAPH_PROXY_CALL_FILTER } from './GRAPH_PROXY_CALL_FILTER'

export const ASYNC_GRAPH_PROXY_CALL_FILTER = mapObjKey<string>(
  GRAPH_PROXY_CALL_FILTER,
  (_, method: string) => `$${method}`
)
