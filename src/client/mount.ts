import { Context } from './context'
import { Mountable } from './Mountable'

export function mount(mountable: Mountable, context: Context): void {
  mountable.mount(context)
}
