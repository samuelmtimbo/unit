import { createServiceStore } from '../store'

export let store

export const connect = () => {
  if (!store) {
    store = createServiceStore('graph')
  }

  return store
}
