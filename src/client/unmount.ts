import { Mountable } from './Mountable'

export function unmount(component: Mountable): void {
  component.unmount()
}
