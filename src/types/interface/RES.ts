export interface RES {
  toJson(): Promise<any>
  toText(): Promise<string>
  toBlob(): Promise<Blob>
}
