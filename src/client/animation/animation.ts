import { ANIMATION_T_S } from './ANIMATION_T_S'

export const ANIMATION_T_MS = ANIMATION_T_S * 1000

export const linearTransition = (...props: string[]): string => {
  const transition = props
    .map((prop) => `${prop} ${ANIMATION_T_S}s linear`)
    .join(', ')

  return transition
}

export const ifLinearTransition = (
  animate: boolean,
  ...props: string[]
): string | undefined => {
  if (animate) {
    return linearTransition(...props)
  } else {
    return undefined
  }
}
