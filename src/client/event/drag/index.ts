import { UnitMouseEvent } from '../pointer'

export interface UnitDataTransferItem {
  kind: string
  type: string
}

export interface UnitDataTransfer {
  dropEffect: string
  effectAllowed: string
  files: FileList
  items: UnitDataTransferItem[]
  types: string[]
}

export interface UnitDragEvent extends UnitMouseEvent {
  dataTransfer: UnitDataTransfer
}

export const parseDataTransfer = (
  dataTransfer: DataTransfer
): UnitDataTransfer => {
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
): UnitDataTransferItem[] => {
  const result: UnitDataTransferItem[] = []

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
