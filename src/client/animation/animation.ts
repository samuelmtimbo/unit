import { ANIMATION_T_S } from './ANIMATION_T_S'

export const ANIMATION_T_MS = ANIMATION_T_S * 1000

export const transition = (props: string[], type: string): string => {
  const transition = props
    .map((prop) => `${prop} ${ANIMATION_T_S}s ${type}`)
    .join(', ')

  return transition
}

export const linearTransition = (...props: string[]): string => {
  return transition(props, 'linear')
}

export const easeInTransition = (...props: string[]): string => {
  return transition(props, 'ease-in')
}

export const ifLinearTransition = (
  animate: boolean,
  ...props: string[]
): string => {
  if (animate) {
    return linearTransition(...props)
  } else {
    return ''
  }
}
