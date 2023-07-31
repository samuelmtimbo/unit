import { GraphSubComponentSpec } from '.'

export type InjectSubComponentOpt = {
  children: string[]
  spec: GraphSubComponentSpec
  parent_id: string | null
  index: number
  width: number
  height: number
}
