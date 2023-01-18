import { CHAIN_ID, provider, goerliWETH, goerliUSDC, SWAP_ADDRESS, ERC20ABI } from './vars'
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router'

const { Token, CurrencyAmount, TradeType, Percent } = require('@uniswap/sdk-core')
const { ethers, BigNumber } = require('ethers')
const JSBI = require('jsbi')

export const getWethContract = () => new ethers.Contract(goerliWETH.address, ERC20ABI, provider)
export const getUSDCContract = () => new ethers.Contract(goerliUSDC.address, ERC20ABI, provider)
export const TOKEN0 = new Token(CHAIN_ID, goerliWETH.address, goerliWETH.decimals, goerliWETH.symbol, goerliWETH.name)
export const TOKEN1 = new Token(CHAIN_ID, goerliUSDC.address, goerliUSDC.decimals, goerliUSDC.symbol, goerliUSDC.name)

const router = new AlphaRouter({ chainId: CHAIN_ID, provider })

export const getPrice = async (amount: any, slippageAmount = 5, walletAddress: string) => {
  try {
    const wei = ethers.utils.parseUnits(amount.toString(), goerliWETH.decimals)
    const currencyAmount = CurrencyAmount.fromRawAmount(TOKEN0, JSBI.BigInt(wei))

    const route: any = await router.route(
      currencyAmount,
      TOKEN1,
      TradeType.EXACT_INPUT,
      {
        recipient: walletAddress,
        slippageTolerance: new Percent(slippageAmount, 100),
        deadline: Math.floor(Date.now() / 1000 + 1800),
        type: SwapType.SWAP_ROUTER_02,
      },
    )

    console.log(route, 'route')
    console.log(wei, 'wei')
    console.log(currencyAmount, 'currencyAmount')

    const transaction = {
      data: route.methodParameters.calldata,
      to: walletAddress,
      value: BigNumber.from(route.methodParameters.value),
      from: walletAddress,
      gasPrice: BigNumber.from(route.gasPriceWei),
      gasLimit: ethers.utils.hexlify(1000000),
    }

    const quoteAmountOut = route.quote.toFixed(6)
    const ratio = (amount / quoteAmountOut).toFixed(3)
    return [transaction, quoteAmountOut, ratio]
  } catch (e) {
    console.log(e, 'error')
  }
}

export const runSwap = async (transaction: any, signer: { sendTransaction: (arg0: any) => void }) => {
  const approvalAmount = ethers.utils.parseUnits('10', 18).toString()
  const contract0 = getWethContract()
  await contract0.connect(signer).approve(SWAP_ADDRESS, approvalAmount)

  signer.sendTransaction(transaction)
}
