import { SharedObject } from '../../SharedObject'
import { Dict } from '../../types/Dict'
import { LocalStore, Store } from '../host'
import { CloudStore } from './CloudStore'

export const DEFAULT_SERVICE_STORE_TYPES = [
  // 'session',
  'local',
  'user',
  'shared',
]

export function createServiceStore<T>(
  name: string
): Dict<SharedObject<Store<any>>> {
  // console.log('createServiceStore', name)
  const { href } = location

  const service = {
    local: new SharedObject(new LocalStore<T>(name)),
    user: new SharedObject(new CloudStore<any>(`${href}/cloud/${name}`)),
    shared: new SharedObject(new CloudStore<any>(`${href}/shared/${name}`)),
  }
  return service
}
