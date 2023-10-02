import { camelToSnake } from '../client/id'
import { Dict } from '../types/Dict'
import { G_METHOD_CALL_SET } from '../types/interface/async/$G'

export const GRAPH_CALL_EVENT_MAP: Dict<string> = G_METHOD_CALL_SET.reduce(
  (acc, method) => {
    return { ...acc, [method]: camelToSnake(method) }
  },
  {}
)
