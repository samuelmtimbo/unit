let _load_web3_promise: Promise<any>

export interface TransactionReceipt {
  status: boolean
  transactionHash: string
  transactionIndex: number
  blockHash: string
  blockNumber: number
  from: string
  to: string
  contractAddress?: string
  cumulativeGasUsed: number
  gasUsed: number
  logs: Log[]
  logsBloom: string
  events?: {
    [eventName: string]: EventLog
  }
}

export interface EventLog {
  event: string
  address: string
  returnValues: any
  logIndex: number
  transactionIndex: number
  transactionHash: string
  blockHash: string
  blockNumber: number
  raw?: { data: string; topics: any[] }
}

export interface Log {
  address: string
  data: string
  topics: string[]
  logIndex: number
  transactionIndex: number
  transactionHash: string
  blockHash: string
  blockNumber: number
}

export interface PromiEvent<T> extends Promise<T> {
  once(type: 'sending', handler: (payload: object) => void): PromiEvent<T>

  once(type: 'sent', handler: (payload: object) => void): PromiEvent<T>

  once(
    type: 'transactionHash',
    handler: (transactionHash: string) => void
  ): PromiEvent<T>

  once(
    type: 'receipt',
    handler: (receipt: TransactionReceipt) => void
  ): PromiEvent<T>

  once(
    type: 'confirmation',
    handler: (
      confirmationNumber: number,
      receipt: TransactionReceipt,
      latestBlockHash?: string
    ) => void
  ): PromiEvent<T>

  once(type: 'error', handler: (error: Error) => void): PromiEvent<T>

  once(
    type: 'error' | 'confirmation' | 'receipt' | 'transactionHash',
    handler: (error: Error | TransactionReceipt | string) => void
  ): PromiEvent<T>

  on(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>

  on(
    type: 'receipt',
    handler: (receipt: TransactionReceipt) => void
  ): PromiEvent<T>

  on(
    type: 'confirmation',
    handler: (
      confNumber: number,
      receipt: TransactionReceipt,
      latestBlockHash?: string
    ) => void
  ): PromiEvent<T>

  on(type: 'error', handler: (error: Error) => void): PromiEvent<T>

  on(
    type: 'error' | 'confirmation' | 'receipt' | 'transactionHash',
    handler: (error: Error | TransactionReceipt | string) => void
  ): PromiEvent<T>
}

export type chain = 'mainnet' | 'goerli' | 'kovan' | 'rinkeby' | 'ropsten'

export type hardfork =
  | 'chainstart'
  | 'homestead'
  | 'dao'
  | 'tangerineWhistle'
  | 'spuriousDragon'
  | 'byzantium'
  | 'constantinople'
  | 'petersburg'
  | 'istanbul'

export interface CustomChainParams {
  name?: string
  networkId: number
  chainId: number
}

export interface Common {
  customChain: CustomChainParams
  baseChain?: chain
  hardfork?: hardfork
}

export interface TransactionConfig {
  from?: string | number
  to?: string
  value?: number | string
  gas?: number | string
  gasPrice?: number | string
  data?: string
  nonce?: number
  chainId?: number
  common?: Common
  chain?: string
  hardfork?: string
}

export async function loadWeb3JS(): Promise<any> {
  if (!_load_web3_promise) {
    _load_web3_promise = (async () => {
      const { href } = location
      const WEB3JS_URL = `${href}/3rd/web3.js`
      await import(WEB3JS_URL)
      // @ts-ignores
      return window.Web3
    })()
  }

  return _load_web3_promise
}

export async function loadETH(): Promise<any> {
  const Web3 = await loadWeb3JS()
  // @ts-ignore
  const web3 = new Web3(window.ethereum)
  // const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  return web3
}

export async function getAccounts(
  callback: (err: any, data: string) => void
): Promise<string[]> {
  const web3 = await loadETH()
  const accs = await web3.eth.getAccounts(callback)
  return accs
}

export async function requestAccounts(
  callback: (err: any, data: string) => void
): Promise<string[]> {
  const web3 = await loadETH()
  const accs = await web3.eth.requestAccounts(callback)
  return accs
}

export async function sendTransaction(config: TransactionConfig): Promise<any> {
  const web3 = await loadETH()
  const emitter = web3.eth.sendTransaction(config)
  return emitter
}
