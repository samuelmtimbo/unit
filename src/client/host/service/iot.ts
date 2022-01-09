import { None } from '../../../types/None'
import { LocalStore } from '../../store'
import { CloudStore } from '../CloudStore'

export type ContainerTypeSpec = 'computer' | 'mobile' | 'cloud'

export type IOTSpecs = {
  [host: string]: IOTSpec
}

export type IOTSpec = {
  name: string
  platform: ContainerTypeSpec
  state: VMStateSpec
}

export type VMStateSpec = {
  connection: IOTStateConnectionSpec
  units: IOTStateUnitsSpec
}

export type IOTConnectionStatus = 'idle' | 'connected' | 'connecting' | 'error'

export type IOTStateConnectionSpec = {
  status: IOTConnectionStatus
  err?: string | None
}

export type IOTStateUnitsSpec = {
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

export const localStore = new LocalStore<IOTSpec>('iot')
export const cloudStore = new CloudStore<IOTSpec>(location.origin)
export const sharedStore = new CloudStore<IOTSpec>(location.origin)
