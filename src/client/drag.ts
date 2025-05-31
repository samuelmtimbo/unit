import { readDataTransferItemAsText } from './event/drag'

export async function readDropEventItemsAsText(
  event: DragEvent
): Promise<string[]> {
  const { dataTransfer } = event

  const { items } = dataTransfer

  const promises: Promise<string>[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    promises.push(readDataTransferItemAsText(item))
  }

  const texts: string[] = await Promise.all(promises)

  return texts
}
