import { Position } from '../client/util/geometry/types'
import { Dict } from './Dict'
import { GraphSpec } from './GraphSpec'
import { IO } from './IO'
import { IOOf } from './IOOf'
import { None } from './None'
import { UnitClass } from './UnitClass'

export type Type = string

export type Types = Dict<Type>

export type GraphUnitPinSpec = {
  data?: string
  constant?: boolean | None
  ignored?: boolean | None
  ref?: boolean
  metadata?: {
    position?: { x: number; y: number }
  }
}

export type GraphUnitPinsSpec = Dict<GraphUnitPinSpec>

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
  position?: Dict<Position>
}

export type PinSpec = PinSpecBase | GraphPinSpec

export type PinsSpecBase = Dict<PinSpecBase>

export type GraphExposedMergeSpec = PinSpecBase & {
  mergeId: string
  unitId?: undefined
  pinId?: undefined
}

export type GraphExposedLinkPinSpec = PinSpecBase & {
  unitId: string
  pinId: string
  mergeId?: undefined
}

export type GraphExposedEmptyPinSpec = PinSpecBase & {
  unitId?: undefined
  pinId?: undefined
  mergeId?: undefined
}

export type GraphSubPinSpec =
  | GraphExposedMergeSpec
  | GraphExposedLinkPinSpec
  | GraphExposedEmptyPinSpec

export type GraphPinSpec = PinSpecBase & {
  plug?: Dict<GraphSubPinSpec>
}

export type GraphPinsSpec = Dict<GraphPinSpec>

export type PinsSpec = Dict<PinSpec>

export type Classes = Dict<UnitClass<any>>

export type GraphUnitSpecBase = {
  input?: GraphUnitPinsSpec
  output?: GraphUnitPinsSpec
  state?: Dict<any>
  memory?: { input: Dict<any>; output: Dict<any>; memory: Dict<any> }
  flag?: Dict<any>
  children?: GraphUnitSpec[] | None
  reorder?: string[] | None
}

export type GraphUnitSpec = GraphUnitSpecBase & {
  id: string
  metadata?: GraphUnitMetadataSpec
}

export type GraphUnitsSpec = Dict<GraphUnitSpec>

export type GraphMergeSpec = Dict<GraphMergeUnitSpec>

export type GraphMergeUnitSpec = IOOf<Dict<true>>

export type GraphMergesSpec = Dict<GraphMergeSpec>

export type DatumSpec = string

export type GraphDataSpec = Dict<DatumSpec>

export type BaseSpec = {
  id: string
  base: true
  type?: string
  method?: boolean
  private?: boolean
  system?: boolean
  name: string
  inputs: PinsSpecBase
  outputs: PinsSpecBase
  methods?: Dict<boolean>
  metadata?: NodeMetadataSpec
  render?: boolean
  component?: ComponentSpec
  deps?: string[]
}

// <T>:<T>
// <T>:any
// string:string
// string:MediaStream
// number:number
// number:string
// (number):number
// (number,number):number
// (string,number,number):(string, string)
export type UnitInterfaceSpec = {
  inputs: PinsSpecBase
  outputs: PinsSpecBase
}

export type Artifact = 'spec' | 'component' | 'dir' | 'data'

export type GraphSpecBase = {
  merges?: GraphMergesSpec
  inputs?: GraphPinsSpec
  outputs?: GraphPinsSpec
}

export type BaseSpecs = {
  [path: string]: BaseSpec
}

export type GraphSpecs = {
  [name: string]: GraphSpec
}

export type Spec = BaseSpec | GraphSpec

export type Specs = {
  [path: string]: Spec
}

export type GraphMetadataSpec = NodeMetadataSpec & {
  position?: Dict<Dict<{ x: number; y: number }> | None>
}

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
}

export type Metadata = {
  rename: string
  icon: string
  description: string
  complexity?: number
}

// a spec action is for a specific path
export type SpecAction = {
  path: string
  type: string
  data: any
}

export type Action = {
  type: string
  data: any
  group_id?: string
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
  position?: { x: number; y: number }
}

export type GraphUnitPinOuterSpec = {
  unitId: string
  type: IO
  pinId: string
}

export type GraphPlugOuterSpec = {
  type: IO
  pinId: string
  subPinId: string
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
