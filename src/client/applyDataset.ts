import { Dict } from '../types/Dict'

export default function applyDataset(
  element: HTMLElement,
  data: Dict<string> = {}
) {
  const dataset = element.dataset
  for (let prop in dataset) {
    if (data[prop] === undefined) {
      delete dataset[prop]
    }
  }
  for (let prop in data) {
    const value = data[prop]
    element.dataset[prop] = value
  }
}
