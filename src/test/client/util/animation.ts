export function flushAnimation(animation: Animation): void {
  animation.commitStyles()
  animation.cancel()
  try {
  } catch {
    //
  }
}

export async function waitFinish(animation: Animation): Promise<Animation> {
  if (animation.playState === 'finished') {
    return animation
  }

  return Promise.race([
    new Promise<Animation>((resolve) => {
      const listener = () => {
        animation.removeEventListener('finish', listener)

        resolve(animation)
      }

      animation.addEventListener('finish', listener)
    }),
    new Promise<Animation>((resolve) => {
      const listener = () => {
        animation.removeEventListener('cancel', listener)

        resolve(animation)
      }

      animation.addEventListener('cancel', listener)
    }),
  ])
}
