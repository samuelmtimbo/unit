import { Dict } from '../../types/Dict'
import { None } from '../../types/None'

export interface Config {
  paused?: boolean | None
  catchErr?: boolean | None
  state?: Dict<any>
}
