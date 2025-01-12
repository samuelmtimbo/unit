export interface WSS {
  handleUpgrade(req: Request): Promise<void>
}
