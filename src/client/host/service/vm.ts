import { None } from '../../../types/None'

export type VMSpecs = {
  [id: string]: VMSpec
}

export type VMSpec = {
  name: string
  on: boolean
  config: VMConfigSpec
  units: VMUnitsSpec
}

export type VMConfigSpec = {
  cpu: number
  memory: number
  network: number
}

export type VMStateSpec = {
  connection: VMStateConnectionSpec
  units: VMUnitsSpec
}

export type VMConnectionStatus = 'idle' | 'connected' | 'connecting' | 'error'

export type VMStateConnectionSpec = {
  status: VMConnectionStatus
  err?: string | None
}

export type VMUnitsSpec = {
  [id: string]: VMUnitSpec
}

export type ContainerUnitStatus = 'idle' | 'running' | 'error'

export const DEFAULT_CONTAINER_STATE: VMStateSpec = {
  connection: {
    status: 'idle',
    err: null,
  },
  units: {},
}

export type VMUnitSpec = {
  path: string
  status: ContainerUnitStatus
  err?: string | None
}
