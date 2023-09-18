import { $map } from './$map'
import { GRAPH_WATCH_EVENT_SET } from './GRAPH_WATCH_EVENT_SET'

export const ASYNC_GRAPH_WATCH_SET = new Set(
  [...GRAPH_WATCH_EVENT_SET].map($map)
)
