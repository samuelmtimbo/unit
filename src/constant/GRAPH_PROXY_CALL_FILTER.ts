import { camelToSnake } from '../client/id'
import { Dict } from '../types/Dict'
import { G_METHOD_CALL_SET_THIS } from '../types/interface/async/$G'

export const GRAPH_PROXY_CALL_FILTER: Dict<string> =
  G_METHOD_CALL_SET_THIS.reduce((acc, method) => {
    return { ...acc, [method]: camelToSnake(method) }
  }, {})
