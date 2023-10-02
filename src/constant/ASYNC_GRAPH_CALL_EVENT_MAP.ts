import { mapObjKey } from '../util/object'
import { GRAPH_CALL_EVENT_MAP } from './GRAPH_CALL_EVENT_MAP'

export const ASYNC_GRAPH_CALL_EVENT_MAP = mapObjKey<string>(
  GRAPH_CALL_EVENT_MAP,
  (_, method: string) => `$${method}`
)
