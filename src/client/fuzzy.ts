export function levenshtein(a: string, b: string): number {
  let t: number[] = [],
    u,
    i,
    j,
    m = a.length,
    n = b.length
  if (!m) {
    return n
  }
  if (!n) {
    return m
  }
  for (j = 0; j <= n; j++) {
    t[j] = j
  }
  for (i = 1; i <= m; i++) {
    for (u = [i], j = 1; j <= n; j++) {
      u[j] =
        a[i - 1] === b[j - 1]
          ? t[j - 1]
          : Math.min(t[j - 1], t[j], u[j - 1]) + 1
    }
    t = u
  }
  return u[n]
}

// tests
;[
  ['', '', 0],
  ['yo', '', 2],
  ['', 'yo', 2],
  ['yo', 'yo', 0],
  ['tier', 'tor', 2],
  ['saturday', 'sunday', 3],
  ['mist', 'dist', 1],
  ['tier', 'tor', 2],
  ['kitten', 'sitting', 3],
  ['stop', 'tops', 2],
  ['rosettacode', 'raisethysword', 8],
  ['mississippi', 'swiss miss', 8],
].forEach(function (v) {
  const [a, b, t] = v
  const d = levenshtein(a as string, b as string)
  if (d !== t) {
    // eslint-disable-next-line no-console
    console.log(
      'levenstein("' + a + '","' + b + '") was ' + d + ' should be ' + t
    )
  }
})
