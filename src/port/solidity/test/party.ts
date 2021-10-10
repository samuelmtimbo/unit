import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Party, Party__factory } from '../typechain'

describe('Party', function () {
  it('', async function () {
    const Party = (await ethers.getContractFactory('Party')) as Party__factory

    const name = 'unit Party'
    const maxAttendees = 100
    const entranceFee = ethers.utils.parseEther('0.05')
    const maxInvitesPerAttendee = 3

    const party = await Party.deploy(
      name,
      maxAttendees,
      entranceFee,
      maxInvitesPerAttendee
    )

    await party.deployed()

    const inviteTx = await party.invite(
      '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
      { value: ethers.utils.parseEther('1') }
    )

    await inviteTx.wait()

    const inviteCost = await party.inviteCost()

    expect(inviteCost).to.equal('100000000000000000')
  })
})
