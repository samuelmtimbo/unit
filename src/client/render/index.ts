import { $Graph } from '../../interface/async/$Graph'
import { Pod } from '../../pod'
import { System } from '../../system'
import { Unlisten } from '../../types/Unlisten'
import { renderGraph } from './renderPod'

export function render(
  root: HTMLElement,
  system: System,
  pod: Pod,
  $graph: $Graph
): Unlisten {
  const unlisten = renderGraph(system.foreground.app, system, pod, $graph)

  return () => {
    system.mounted = false
    system.root = null

    unlisten()
  }
}
