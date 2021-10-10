import { expect } from 'chai'
import { BaseContract } from 'ethers'
import { ethers } from 'hardhat'
import * as contract from '../typechain'
const { utils } = ethers

const units = ['Add', 'Multiply', 'Subtract', 'Get', 'Set', 'Delete', 'Storage']

let mothership: contract.Mothership

before(async () => {
  mothership = await deployContract('Mothership')
  await Promise.all(units.map((u) => register(u)))
})

async function deployContract<Contract extends BaseContract>(
  name: string,
  ...args: unknown[]
) {
  const factory = await ethers.getContractFactory(name)
  const contract = await factory.deploy(...args)
  await contract.deployed()
  return contract as Contract
}

async function register(unit: string) {
  const factory = await deployContract(unit + 'Factory')
  const regTx = await mothership.register(unit.toLowerCase(), factory.address)
  await regTx.wait()
}

function functionRef<C extends BaseContract>(
  contract: C,
  funcSig: string
): string {
  const functions = contract.interface.functions
  expect(functions).to.haveOwnProperty(funcSig)

  const sighash = utils.Interface.getSighash(functions[funcSig])
  return utils.hexlify([
    ...utils.arrayify(contract.address),
    ...utils.arrayify(sighash),
  ])
}

describe('Graph420Entry', function () {
  let graph420: contract.GraphGraph420Entry

  before(async function () {
    graph420 = await deployContract('Graph_graph_420_entry', mothership.address)
  })

  const inputs = [1, 2, 3, 5, 8, 13, 21, 34, 55]
  for (const idx in inputs) {
    const a = inputs[idx]
    const data = Math.floor(a / 2 + 1)

    it(`should do the calculation for a=${idx} data=${data}`, async function () {
      await graph420.input_a(a).then((tx) => tx.wait())
      await graph420.input_data(data).then((tx) => tx.wait())
      await graph420.input_name('masterkey-' + idx).then((tx) => tx.wait())

      const [ok, bignum] = await graph420.peekOutput_a_$_b()
      expect(ok).to.be.true
      const result = parseInt(bignum.toString())
      expect(result).to.equal((a + data) * a)
      await graph420.popOutput_a_$_b().then((tx) => tx.wait())
    })
  }

  it('should be registrable on mother', async function () {
    await register('Graph_graph_420_') // this works!

    // From now on it's kind of bogus. Check comment in the end. In the end,
    // this is why we need an `Entry` contract which possibilitates interactions
    // with the unit/graph and the outer world.
    const heap = await deployContract<contract.Heap>('Heap')
    const input = await deployContract<contract.DataHolder>('DataHolder', 3)
    const output = await deployContract<contract.DataHolder>('DataHolder', 1)

    const consumeInputRef = functionRef(input, 'delete_(uint32)')
    const setOutputRef = functionRef(output, 'set(uint32,(uint8,uint32[]))')

    const registered = await mothership.get('graph_graph_420_')
    const factory = (await ethers.getContractAt(
      'UnitFactory',
      registered[1]
    )) as contract.UnitFactory
    // This is hell! Even encoding the function with the wire format, ethers.js
    // does not support sending functions as arguments. It doesn't support a
    // 'function' baseType on its internal interface/encoder definitions.
    const getGraphTx =
      false &&
      (await factory
        .create(mothership.address, heap.address, setOutputRef, consumeInputRef)
        .then((tx) => tx.wait()))
  })
})
