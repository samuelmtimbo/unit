export function randomBetween(a: number, b: number): number {
  return a + (b - a) * Math.random()
}

export function randomNaturalBetween(a: number, b: number): number {
  return Math.floor(randomBetween(a, b))
}

export function randomIntegerBetween(a: number, b: number): number {
  return Math.floor(randomBetween(a, b))
}

export function randomMatrix<T>(
  rows: number,
  columns: number,
  generator: (row: number, column: number) => T
): T[][] {
  const matrix: T[][] = []
  for (let i = 0; i < rows; i++) {
    matrix[i] = []
    for (let j = 0; j < columns; j++) {
      matrix[i][j] = generator(i, j)
    }
  }
  return matrix
}

export function chance(chance: number = 0.5): boolean {
  return Math.random() <= chance
}
