export function readFileAsText(file: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = async (event) => {
      const text = event.target.result.toString()

      resolve(text)
    }

    reader.readAsText(file)
  })
}
