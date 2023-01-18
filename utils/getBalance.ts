import { provider } from './vars'
import { ethers } from 'ethers'

export const getBalance = (address: string) => {
  return provider.getBalance(address).then(balanceRes => {
    return ethers.utils.formatUnits(balanceRes, 18) || 0
  })
}
