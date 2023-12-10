import { IOMouseEvent } from '../pointer'

export interface IODataTransferItem {
  kind: string
  type: string
}

export interface IODataTransfer {
  dropEffect: string
  effectAllowed: string
  files: FileList
  items: IODataTransferItem[]
  types: string[]
}

export interface IODragEvent extends IOMouseEvent {
  dataTransfer: IODataTransfer
}

export const parseDataTransfer = (
  dataTransfer: DataTransfer
): IODataTransfer => {
  const { dropEffect, effectAllowed, files, items, types } = dataTransfer

  return {
    dropEffect,
    effectAllowed,
    files,
    items: parseDataTransferItems(items),
    types: [...types],
  }
}

export const parseDataTransferItems = (
  items: DataTransferItemList
): IODataTransferItem[] => {
  const result: IODataTransferItem[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    const { kind, type } = item

    result.push({ kind, type })
  }

  return result
}

export const readDataTransferItemAsText = (
  dataTransferItem: DataTransferItem
) => {
  return new Promise<string>((resolve, reject) => {
    if (dataTransferItem.kind === 'file') {
      const file = dataTransferItem.getAsFile()

      resolve(file.text())

      return
    } else {
      dataTransferItem.getAsString(resolve)
    }
  })
}
