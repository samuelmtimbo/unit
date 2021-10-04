import __specs from '../../system/_specs'
import { INCREMENT, ONE, PRIORITY_MERGE, RANGE_ARRAY, SINGLE } from './id'

globalThis.__specs = globalThis.__specs || __specs

const paths = [INCREMENT, ONE, SINGLE, RANGE_ARRAY, PRIORITY_MERGE]

// for (const path of paths) {
//   console.log(path, treeComplexityByPath(path))
// }
