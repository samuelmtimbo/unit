import { GraphUnitSpec } from '../../../types'

export type ContainerTypeSpec = 'computer' | 'mobile' | 'cloud'

export type WebSpecs = {
  [id: string]: WebSpec
}

export type WebSpec = {
  title: string
  unit: GraphUnitSpec
  host: string
  public?: boolean
  state: WebSpecState
}

export type WebSpecState = 'idle' | 'deploying' | 'deployed'
