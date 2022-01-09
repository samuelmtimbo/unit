import { Unlisten } from '../types/Unlisten'
import Listenable from './Listenable'

export type Listener = (listenable: Listenable) => Unlisten
