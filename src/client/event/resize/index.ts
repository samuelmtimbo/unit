import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { listenCustom } from '../custom'

export type IOFrameResizeEvent = {
  width: number
  height: number
}

export function makeResizeListener(
  listener: (data: IOFrameResizeEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenResize(component, listener)
  }
}

export function listenResize(
  component: Listenable,
  listener: (event: IOFrameResizeEvent) => void,
  _global: boolean = false
): () => void {
  return listenCustom('resize', component, listener, _global)
}
