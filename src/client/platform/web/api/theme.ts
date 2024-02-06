import { API } from '../../../../API'
import { BootOpt } from '../../../../system'
import { Theme, themeBackgroundColor } from '../../../theme'

export function webTheme(
  window: Window,
  root: HTMLElement,
  opt: BootOpt
): API['theme'] {
  const theme: API['theme'] = {
    setTheme: async function (theme: Theme): Promise<void> {
      const color = themeBackgroundColor(theme)

      root.style.backgroundColor = color
    },
  }

  return theme
}
