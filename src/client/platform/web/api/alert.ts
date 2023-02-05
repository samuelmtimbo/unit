import { API } from '../../../../API'
import { BootOpt } from '../../../../system'

export function webAlert(window: Window, opt: BootOpt): API['alert'] {
  const { alert, prompt } = window

  return {
    alert,
    prompt,
  }
}
