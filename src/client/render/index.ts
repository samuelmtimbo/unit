import { $Graph } from '../../interface/async/$Graph'
import { Pod } from '../../pod'
import { System } from '../../system'
import { Unlisten } from '../../types/Unlisten'
import { attachApp } from './attachApp'
import { attachCanvas } from './attachCanvas'
import { attachGesture } from './attachGesture'
import { attachLongPress } from './attachLongPress'
import { attachSprite } from './attachSprite'
import { attachSVG } from './attachSVG'
import { renderGraph } from './renderPod'

export function render(
  root: HTMLElement,
  system: System,
  pod: Pod,
  $graph: $Graph
): Unlisten {
  system.root = root
  system.mounted = true

  attachSprite(system)
  attachApp(system)
  attachCanvas(system)
  attachGesture(system)
  attachSVG(system)
  attachLongPress(system)

  const unlisten = renderGraph(system.foreground.app, system, pod, $graph)

  return () => {
    system.mounted = false
    system.root = null

    unlisten()
  }
}
