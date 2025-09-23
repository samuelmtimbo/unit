export function binaryFindIndex<A>(
  arr: Array<A>,
  predicate: (value: A, index: number) => number
): number {
  let upper_bound = arr.length
  let lower_bound = 0

  let i: number = -1

  while (true) {
    i = Math.floor((upper_bound + lower_bound) / 2)

    const element = arr[i]

    const score = predicate(element, i)

    if (score === 0) {
      return i
    } else if (score > 0) {
      upper_bound = i
    } else {
      lower_bound = i
    }

    if (upper_bound <= lower_bound || i >= lower_bound) {
      break
    }
  }

  return i
}
