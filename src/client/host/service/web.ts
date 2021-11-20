import { SharedObject } from '../../../SharedObject'
import { GraphUnitSpec } from '../../../types'
import { Dict } from '../../../types/Dict'
import { Store } from '../../host'
import { createServiceStore } from '../store'

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

export let store: Dict<SharedObject<Store<any>>>

export const connect = () => {
  if (!store) {
    store = createServiceStore<WebSpec>('web')
  }

  return store
}
