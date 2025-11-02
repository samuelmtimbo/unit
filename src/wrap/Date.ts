import { $, $Events } from '../Class/$'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { D } from '../types/interface/D'

export type DateEE = {}

export type DateEvents<_EE extends Dict<any[]>> = $Events<_EE & DateEE> & DateEE

export function wrapDate(date: Date, system: System): D & $<DateEvents<{}>> {
  const socket = new (class Date_ extends $ implements D {
    __: string[] = ['D']

    getTime(): number {
      return date.getTime()
    }

    getDate(): number {
      return date.getDate()
    }

    setHours(hours: number, min: number, sec: number, ms: number): void {
      date.setHours(hours, min, sec, ms)
    }

    setDate(day: number): void {
      date.setDate(day)
    }
  })(system)

  return socket
}
