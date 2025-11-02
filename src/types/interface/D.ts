export interface D {
  getDate(): number
  getTime(): number
  setHours(
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number
  ): void
  setDate(day: number): void
}
