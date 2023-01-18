import { CHAIN_ID, provider, rinkeUSDC, rinkeWETH, router, SWAP_ADDRESS, ERC20ABI } from './vars'
import { SwapType } from "@uniswap/smart-order-router";
const { Token, CurrencyAmount, TradeType, Percent } = require('@uniswap/sdk-core')
const { ethers, BigNumber } = require('ethers')
const JSBI = require('jsbi')

export const getWethContract = () => new ethers.Contract(rinkeWETH.address, ERC20ABI, provider)
export const getUSDCContract = () => new ethers.Contract(rinkeUSDC.address, ERC20ABI, provider)

export const getPrice = async (amount: any = 1, slippageAmount = 1, walletAddress: string) => {
  const WETH = await new Token(CHAIN_ID, rinkeWETH.address, rinkeWETH.decimals, rinkeWETH.symbol, rinkeWETH.name)
  const USDC = await new Token(CHAIN_ID, rinkeUSDC.address, rinkeUSDC.decimals, rinkeUSDC.symbol, rinkeUSDC.name)
  try {
    console.log(walletAddress, 'walletAddress')
    const amountOutInWei=ethers.utils.parseUnits(amount.toString(),rinkeWETH.decimals)
    const currencyAmount= CurrencyAmount.fromRawAmount(WETH,JSBI.BigInt(amountOutInWei))
    const route: any = await router.route(currencyAmount, USDC, TradeType.EXACT_INPUT, {
      recipient: walletAddress,
      slippageTolerance: new Percent(slippageAmount, 100),
      deadline: Math.floor(Date.now() / 1000)+10*60,
      type: SwapType.SWAP_ROUTER_02,
    })
    console.log(route, 'route')
    console.log(currencyAmount, 'wethAmount')
    console.log(amountOutInWei, 'wei')

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
