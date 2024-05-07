import { ComponentSpec, PinsSpecBase } from '.'
import { Dict } from './Dict'
import { NodeMetadataSpec } from './NodeMetadataSpec'

export type BaseSpec = {
  id: string
  base: true
  type?: string
  method?: boolean
  private?: boolean
  system?: boolean
  user?: boolean
  name: string
  inputs: PinsSpecBase
  outputs: PinsSpecBase
  methods?: Dict<boolean>
  metadata?: NodeMetadataSpec
  render?: boolean
  component?: ComponentSpec
  deps?: string[]
}
