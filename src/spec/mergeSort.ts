export function mergeSort(a: number[], b: number[]) {
  let i = 0
  let j = 0

  const merge = []

  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length) {
      if (a[i] < b[j]) {
        merge.push(a[i])
        i++
      } else {
        merge.push(b[j])
        j++
      }
    } else if (i < a.length) {
      merge.push(a[i])
      i++
    } else if (j < b.length) {
      merge.push(b[j])
      j++
    }
  }

  return merge
}
