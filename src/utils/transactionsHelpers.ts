import { BigNumber, ethers } from 'ethers'
import { provider, QUOTER_CONTRACT_ADDRESS, SWAP_ROUTER_ADDRESS, WALLET_ADDRESS } from './vars'
import { Currency, CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core'
import { Route, SwapQuoter } from '@uniswap/v3-sdk'

export const sendTransactionViaWallet = async (
  transaction: ethers.providers.TransactionRequest,
  signer: any
): Promise<any> => {
  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value)
  }
  try {
    const txRes = await signer.sendTransaction(transaction)
    return await txRes.wait().then(async () => {
      try {
        const res = await provider.getTransactionReceipt(txRes.hash)
        console.log(res, 'result ')
        return res
      } catch (e) {
        console.log(`Receipt error:`, e)
        return null
      }
    })
  } catch (e) {
    console.log(`error:`, e)
    return null
  }
}
export const getTokenTransferApproval = async (token0: Token, tokenContract: any, amount: number, signer:any): Promise<any> => {
  if (!signer) {
    console.log('No Provider Found')
    return false
  }

  try {
    const transaction = await tokenContract.populateTransaction.approve(
      SWAP_ROUTER_ADDRESS,
      ethers.utils.parseUnits(amount.toString(), token0.decimals).toString()
    )
    const receipt = await sendTransactionViaWallet({
      ...transaction,
      from: WALLET_ADDRESS,
    }, signer)
    if (receipt) {
      return 'Success'
    }
  } catch (e) {
    console.error(e)
    return false
  }
}
export const getOutputQuote = async (route: Route<Currency, Currency>, tokenIn: Currency, amount: number) => {
  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(tokenIn, ethers.utils.parseUnits(amount.toString(), tokenIn.decimals).toString()),
    TradeType.EXACT_INPUT
  )

  const quoteCallReturnData = await provider.call({
    to: QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  })

  return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData)
}
