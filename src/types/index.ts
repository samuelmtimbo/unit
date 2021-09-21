import { Config } from '../Class/Unit/Config'
import { C } from '../interface/C'
import { G } from '../interface/G'
import { U } from '../interface/U'
import { Dict } from './Dict'
import { None } from './None'
import { UnitClass } from './UnitClass'

export type Kind = 'input' | 'output'

export type Type = string

export type Types = {
  [name: string]: Type
}

export type Set = Dict<any>

export type GraphUnitPinSpec = {
  data?: any
  constant?: boolean | None
  ignored?: boolean | None
  memory?: boolean
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
  type?: string
  init?: string
  icon?: string
  component?: boolean
  metadata?: PinBaseMetadataSpec
}

export type PinBaseMetadataSpec = NodeMetadataSpec & { examples?: any[] }

export type PinSpec = PinSpecBase | GraphExposedPinSpec

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

export type GraphExposedSubPinSpec =
  | GraphExposedMergeSpec
  | GraphExposedLinkPinSpec
  | GraphExposedEmptyPinSpec

export type GraphExposedPinSpec = PinSpecBase & {
  pin?: Dict<GraphExposedSubPinSpec>
}

export type GraphExposedPinsSpec = Dict<GraphExposedPinSpec>

export type PinsSpec = Dict<PinSpec>

export type GraphClass = { id: string; new (config?: Config): U & C & G }

export type Classes = {
  [id: string]: UnitClass<any>
}

export type UnitSpecBase = {
  input?: GraphUnitPinsSpec
  output?: GraphUnitPinsSpec
  state?: Dict<any>
  catchErr?: boolean | None
  children?: { id: string; state: any }[] | None
  lazyLoad?: boolean | None
  reorder?: string[] | None
}

export type GraphUnitSpec = UnitSpecBase & {
  path: string
  metadata?: GraphUnitMetadataSpec
}

export type UnitsSpec = {
  [id: string]: GraphUnitSpec
}

export type GraphMergeSpec = {
  [unitId: string]: {
    input?: {
      [pinId: string]: true
    }
    output?: {
      [pinId: string]: true
    }
  }
}

export type GraphMergesSpec = Dict<GraphMergeSpec>

export type DatumSpec = string

export type GraphDataSpec = {
  [id: string]: DatumSpec
}

export type BaseSpec = {
  base: true
  type?: string
  method?: boolean
  private?: boolean
  system?: boolean
  id?: string
  name: string
  inputs: PinsSpecBase
  outputs: PinsSpecBase
  methods?: Dict<boolean>
  metadata?: NodeMetadataSpec
  component?: ComponentSpec
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
  inputs?: GraphExposedPinsSpec
  outputs?: GraphExposedPinsSpec
}

export type GraphSpec = GraphSpecBase & {
  base?: false
  type?: '`U`&`G`'
  method?: boolean
  private?: boolean
  system?: boolean
  units?: UnitsSpec
  name?: string
  metadata?: GraphMetadataSpec
  data?: GraphDataSpec
  component?: GraphComponentSpec
  methods?: Dict<GraphSpec>
  self?: string | None
  id?: string
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
  editor?: {
    on?: boolean
    lit?: boolean
    edit?: boolean
  }
  position?: Dict<{ x: number; y: number }> | None
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
