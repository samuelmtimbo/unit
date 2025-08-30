import { UIEventName, UI_EVENT_SET } from './makeEventListener'

export function isComponentEvent(event: string): boolean {
  return UI_EVENT_SET.has(event as UIEventName) || event.startsWith('_')
}
