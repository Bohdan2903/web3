import {
  ERC20ABI,
  goerliUSDC,
  goerliWETH,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  SWAP_ROUTER_ADDRESS,
  WALLET_ADDRESS,
} from './vars'

const { ethers } = require('ethers')
import { Currency, CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import { FeeAmount, Pool, Route, SwapOptions, SwapRouter, Trade } from '@uniswap/v3-sdk'
import JSBI from 'jsbi'

import { getPoolInfo } from './pool'
import { getOutputQuote, getTokenTransferApproval, sendTransactionViaWallet } from './transactionsHelpers'

const slippageTolerance: any = new Percent('500', '10000') // 50 bips, or 0.50% - Slippage tolerance

const deadline = Math.floor(Date.now() / 1000 + 1800)

export const getContract = async (tokenAddress: string, signer: any) => {
  return new ethers.Contract(tokenAddress, ERC20ABI, signer)
}

export const getPrice = async (
  amount = 1,
  walletAddress: string,
  token0: any = goerliWETH,
  token1: any = goerliUSDC,
  signer: any
) => {
  try {
    const TOKEN0: Currency = new Token(token0.chainId, token0.address, token0.decimals, token0.symbol, token0.name)
    const TOKEN1: Currency = new Token(token1.chainId, token1.address, token1.decimals, token1.symbol, token1.name)
    const poolData = await getPoolInfo(TOKEN0, TOKEN1, signer)

    const pool = new Pool(
      TOKEN0,
      TOKEN1,
      FeeAmount.MEDIUM,
      poolData.sqrtPriceX96.toString(),
      poolData.liquidity.toString(),
      poolData.tick
    )

    const swapRoute = new Route([pool], TOKEN0, TOKEN1)
    const amountOut = await getOutputQuote(swapRoute, token0, amount)

    const uncheckedTrade = Trade.createUncheckedTrade({
      route: swapRoute,
      inputAmount: CurrencyAmount.fromRawAmount(
        TOKEN0,
        ethers.utils.parseUnits(amount.toString(), token0.decimals).toString()
      ),
      outputAmount: CurrencyAmount.fromRawAmount(TOKEN1, JSBI.BigInt(amountOut)),
      tradeType: TradeType.EXACT_INPUT,
    })
    const outputPrice = uncheckedTrade.outputAmount.toSignificant(6)
    const ratio = uncheckedTrade.executionPrice.toSignificant(6)
    return [uncheckedTrade, outputPrice, ratio]
  } catch (e) {
    console.log(e, 'error')
    return [0, 0]
  }
}

export const runSwap = async (token0: any, tokenContract: any, amount: number, trade: any, signer: any) => {
  try {
    // Give approval to the router to spend the token
    const tokenApproval = await getTokenTransferApproval(token0, tokenContract, amount, signer)
    console.log(tokenApproval, 'approve')
    const options: SwapOptions = {
      slippageTolerance,
      deadline,
      recipient: WALLET_ADDRESS,
    }
    const methodParameters = SwapRouter.swapCallParameters([trade], options)
    console.log(methodParameters, 'methodParameters')

    const tx = {
      data: methodParameters.calldata,
      to: SWAP_ROUTER_ADDRESS,
      value: methodParameters.value,
      from: WALLET_ADDRESS,
      gasLimit: ethers.utils.hexlify(100000),
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    }

    if (tokenApproval == 'Success') {
      const res = await sendTransactionViaWallet(tx, signer)
      console.log(res, 'res')

      return res
    } else {
      return 'error'
    }
  } catch (e) {
    console.log(e, 'error')
  }
}
