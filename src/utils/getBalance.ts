import { ethers } from 'ethers'
import { provider } from "./vars";

export const getBalance = async (address: string) => {
    return provider.getBalance(address).then((balanceRes: ethers.BigNumberish) => {
        return ethers.utils.formatEther(balanceRes)
    })
}
