export type AllKeys<T, V> = { [key in keyof Required<T>]: V }
