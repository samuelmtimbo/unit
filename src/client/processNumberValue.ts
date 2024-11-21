export function processNumberValue(value: string) {
  let data = Number.parseFloat(value)

  if (isNaN(data)) {
    data = 0
  }

  return data
}
