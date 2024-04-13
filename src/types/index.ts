import { Position } from '../client/util/geometry/types'
import { BaseSpec } from './BaseSpec'
import { Dict } from './Dict'
import { GraphPinSpec } from './GraphPinSpec'
import { GraphSpec } from './GraphSpec'
import { IO } from './IO'
import { IOOf } from './IOOf'
import { NodeMetadataSpec } from './NodeMetadataSpec'
import { None } from './None'
import { UnitClass } from './UnitClass'

export type Type = string

export type Types = Dict<Type>

export type PinSpecBase = {
  name?: string
  optional?: boolean
  functional?: boolean
  defaultIgnored?: boolean
  ref?: boolean
  data?: any
  type?: string
  init?: string
  icon?: string
  component?: boolean
  metadata?: PinBaseMetadataSpec
}

export type PinBaseMetadataSpec = NodeMetadataSpec & {
  examples?: any[]
  r?: number
}

export type PinSpec = PinSpecBase | GraphPinSpec

export type PinsSpecBase = Dict<PinSpecBase>

export type GraphExposedMergeSpec = PinSpecBase & {
  mergeId: string
  unitId?: undefined
  pinId?: undefined
  kind?: undefined
}

export type GraphExposedLinkPinSpec = PinSpecBase & {
  unitId: string
  kind?: IO | undefined
  pinId: string
  mergeId?: undefined
}

export type GraphExposedEmptyPinSpec = PinSpecBase & {
  unitId?: undefined
  pinId?: undefined
  mergeId?: undefined
  kind?: undefined
}

export type GraphSubPinSpec =
  | GraphExposedMergeSpec
  | GraphExposedLinkPinSpec
  | GraphExposedEmptyPinSpec

export type GraphPinsSpec = Dict<GraphPinSpec>

export type PinsSpec = Dict<PinSpec>

export type Classes = Dict<UnitClass<any>>

export type DatumSpec = {
  value: string
  metadata?: DatumMetadataSpec
}

export type DatumMetadataSpec = {
  position?: Position
}

export type GraphDataSpec = Dict<DatumSpec>

export type Artifact = 'spec' | 'component' | 'dir' | 'data'

export type Spec = BaseSpec | GraphSpec

export type Specs = {
  [path: string]: Spec
}

export type GraphMetadataSpec = NodeMetadataSpec & {
  position?: Dict<Dict<Position> | None>
}

export type BaseComponentSpec = {
  defaultWidth?: number
  defaultHeight?: number
}

export type BaseComponentSpecs = Dict<BaseComponentSpec>

export type GraphSubComponentSpec = {
  width?: number
  height?: number
  children?: string[]
  childSlot?: Dict<string>
  attr?: Dict<string>
}

export type GraphSubComponentSpecs = Dict<GraphSubComponentSpec>

export type GraphComponentSpec = BaseComponentSpec & {
  slots?: [string, string][]
  subComponents?: GraphSubComponentSpecs
  children?: string[]
}

export type ComponentSpec = GraphComponentSpec | BaseComponentSpec

export type ComponentSpecs = {
  [path: string]: ComponentSpec
}

export type Email = string

export type Comment = {
  author: Email
  comment: string
}

export type Comments = {
  [id: string]: Comment
}

export type GraphUnitMetadataSpec = {
  component?: {
    width?: number
    height?: number
  }
  rename?: string | None
  comment?: string | None
  position?: Position
}

export type GraphUnitPinOuterSpec = {
  unitId: string
  type: IO
  pinId: string
}

export type GraphPlugOuterSpec = {
  type: IO
  pinId: string
  kind?: IO
  subPinId: string
}

export type GraphPlugSpec = GraphPlugOuterSpec & {
  pinSpec: GraphPinSpec
  subPinSpec: GraphSubPinSpec
}

export type GraphUnitOuterSpec = {
  merges: IOOf<
    Dict<{
      mergeId: string
      otherPin: GraphUnitPinOuterSpec | null
      exposedPin: GraphPlugOuterSpec | null
    }>
  >
  exposed: IOOf<Dict<GraphPlugOuterSpec>>
}
