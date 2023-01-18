import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getWethContract, getUSDCContract, getPrice, runSwap } from '../utils/swapConfig'
import { ethers } from 'ethers'

export const SwapForm = ({ wallet }: any) => {
  const [wethContract, setWethContract] = useState<any>(null)
  const [usdcContract, setUsdcContract] = useState<any>(null)
  const [wethAmount, setWethAmount] = useState<string | number>(0)
  const [usdcAmount, setUsdcAmount] = useState<string | number>(0)
  const [ratio, setRatio] = useState<string | number>(0)
  const [transaction, setTransaction] = useState(undefined)
  const [outputAmount, setOutputAmount] = useState(undefined)
  const useFormProps = useForm()
  const { handleSubmit, register } = useFormProps

  useEffect(() => {
    if (wallet.data) {
      onLoad().then(r => r)
      getSwapPrice().then(r => r)
      // setTimeout(() => getSwapPrice(), 5000)
    }
  }, [wallet?.data])
  const onLoad = async () => {
    const wethContract = await getWethContract()
    setWethContract(wethContract)

    const usdcContract = await getUSDCContract()
    setUsdcContract(usdcContract)

    if (wallet.data) {
      await getTokenAmount(wallet.address, wethContract, usdcContract)
    }
  }

  const getTokenAmount = async (address: string, wethContract: any, usdcContract: any) => {
    await wethContract?.balanceOf(address).then((res: ethers.BigNumberish) => {
      setWethAmount(Number(ethers.utils.formatEther(res)))
    })
    await usdcContract?.balanceOf(address).then((res: ethers.BigNumberish) => {
      setUsdcAmount(Number(ethers.utils.formatEther(res)))
    })
  }
  console.log(usdcAmount, wethAmount, 'amount')

  const getSwapPrice = (inputAmount = 0) =>
    getPrice(inputAmount, 0, wallet.address).then((data: any) => {
      console.log(data, 'data')
      // setTransaction(data[0])
      // setOutputAmount(data[1])
      // setRatio(data[2])
    })

  const handleSwap = handleSubmit((data: any) => {
    console.log(data, 'data')
  })

  return (
    <div>
      <div>Total usdc : {usdcAmount}</div>
      <div>Total weth : {wethAmount}</div>
      <form onSubmit={handleSwap}>
        <div>
          <label>
            <span>WETH</span>
            <input
              type="number"
              placeholder={'Enter amount'}
              {...register('token0', {
                required: true,
              })}
            />
          </label>
        </div>
        <div>
          <label>
            <span>USDC</span>
            <input
              type="number"
              placeholder={'Enter amount'}
              {...register('token1', {
                required: true,
              })}
            />
          </label>
        </div>

        <button type={'submit'}>Swap tokens</button>
      </form>
    </div>
  )
}
