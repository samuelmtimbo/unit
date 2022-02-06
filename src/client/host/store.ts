import { SharedObject } from '../../SharedObject'
import { IO_SERVICE_API, System } from '../../system'
import { LocalStore, Store } from '../store'
import { CloudStore } from './CloudStore'

export const DEFAULT_SERVICE_STORE_TYPES = ['local', 'cloud', 'shared']

export function createSharedServiceApi<T>(
  system: System,
  href: string,
  name: string
): IO_SERVICE_API<SharedObject<Store<T>, {}>> {
  return {
    local: new SharedObject(new LocalStore<T>(system, name)),
    cloud: new SharedObject(
      new CloudStore<any>(system, `${href}/cloud/${name}`)
    ),
    shared: new SharedObject(
      new CloudStore<any>(system, `${href}/shared/${name}`)
    ),
  }
}
