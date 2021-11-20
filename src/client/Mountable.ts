import { Context } from './context'

export interface Mountable {
  mount: ($context: Context) => void
  unmount: () => void
}
