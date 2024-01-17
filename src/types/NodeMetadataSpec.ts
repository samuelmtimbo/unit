import { None } from './None'

export type NodeMetadataSpec = {
  icon?: string | None
  tags?: string[]
  description?: string | None
  link?: string | None
  globals?: string[]
  editor?: {
    on?: boolean
    lit?: boolean
    edit?: boolean
  }
  complexity?: number
  author?: string
}
