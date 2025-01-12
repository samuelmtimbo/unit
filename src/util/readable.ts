import { System } from '../system'

export function stringToReadableStream(
  system: System,
  str: string
): ReadableStream {
  const {
    api: {
      window: { ReadableStream },
      text: { TextEncoder },
    },
  } = system

  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(str))
      controller.close()
    },
  })
}
