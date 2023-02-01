import { ethers } from 'ethers'

export const getBalance = (signer: any, address: string) => {
  return signer.getBalance(address).then((balanceRes: ethers.BigNumberish) => {
    return ethers.utils.formatUnits(balanceRes, 18) || 0
  })
}
