const UNSAFE_PORTS = [
  1,
  7,
  9,
  11,
  13,
  15,
  17,
  19,
  20,
  21,
  22,
  23,
  25,
  37,
  42,
  43,
  53,
  77,
  79,
  87,
  95,
  101,
  102,
  103,
  104,
  109,
  110,
  111,
  113,
  119,
  135,
  [137, 139],
  143,
  179,
  389,
  445,
  [512, 514],
  515,
  540,
  554,
  587,
  631,
  666,
  873,
  993,
  995,
  1080,
  [1433, 1434],
  1521,
  2049,
  3306,
  3389,
  [5000, 5001],
  5432,
  [6000, 6063],
  [6660, 6669],
]

export function isUnsafePort(port: number) {
  let low = 0
  let high = UNSAFE_PORTS.length - 1

  while (low <= high) {
    let mid = Math.floor((low + high) / 2)

    let current = UNSAFE_PORTS[mid]

    current = Array.isArray(current) ? current : [current, current]

    const [start, end] = current

    if (port >= start && port <= end) {
      return true
    } else if (port < start) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return false
}
