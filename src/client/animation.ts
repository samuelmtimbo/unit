export const ANIMATION_T = 0.2

export const linearTransition = (props: string | string[]): string => {
  props = Array.isArray(props) ? [] : [props]

  const transition = props
    .map((prop) => `${prop} ${ANIMATION_T}s linear`)
    .join(', ')

  return transition
}

export const ifLinearTransition = (
  animate: boolean,
  props: string | string[]
): string | undefined => {
  if (animate) {
    return linearTransition(props)
  } else {
    return undefined
  }
}
