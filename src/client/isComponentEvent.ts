import { IOUIEventName, UI_EVENT_SET } from './makeEventListener'

export function isComponentEvent(event: string): boolean {
  return UI_EVENT_SET.has(event as IOUIEventName) || event.startsWith('_')
}
