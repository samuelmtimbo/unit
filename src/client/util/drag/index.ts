export async function dataTransferItemAsString(item: DataTransferItem) {
  return new Promise<string>((resolve) => {
    item.getAsString((text: string) => {
      resolve(text)
    })
  })
}
