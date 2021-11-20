import { Unlisten } from '../Unlisten'
import Listenable from './Listenable'

export type Listener = (listenable: Listenable) => Unlisten
