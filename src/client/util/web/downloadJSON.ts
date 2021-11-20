import { Dict } from '../../../types/Dict'
import { downloadData } from './downloadData'

export function downloadJSON(
  name: string,
  obj: Dict<any>,
  ...stringifyArgs: any[]
): void {
  downloadData(
    `${name}.json`,
    JSON.stringify(obj, ...stringifyArgs),
    'text/json',
    'utf-8'
  )
}
