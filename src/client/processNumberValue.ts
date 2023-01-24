export function processNumberValue<E extends HTMLInputElement>(
  $element: E,
  value: string
) {
  let data = Number.parseFloat(value)

  if (isNaN(data)) {
    // value is not a valid number
    if (value === '') {
      $element.value = ''

      data = 0
    }
  }

  return data
}
