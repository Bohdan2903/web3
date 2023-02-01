import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getContract, getPrice, runSwap } from '../utils/swapConfig'
import { BigNumber, ethers } from 'ethers'
import { goerliWETH, goerliUSDC } from '../utils/vars'

export const SwapForm = ({ wallet, signer }: any) => {
  const [token0Contact, setToken0Contract] = useState<any>(null)
  const [token1Contact, setToken1Contract] = useState<any>(null)
  const [trade, setTrade] = useState<any>(null)
  const [token0, setToken0] = useState<any>({ ...goerliWETH, amount: 0 })
  const [token1, setToken1] = useState<any>({ ...goerliUSDC, amount: 0 })
  const [ratio, setRatio] = useState<string | number>('')
  const useFormProps = useForm()
  const { handleSubmit, register, watch, setValue } = useFormProps
  const token0amount = watch('token0')

  useEffect(() => {
    if (wallet.data) {
      onLoad().then(r => r)
    }
  }, [])

  useEffect(() => {
    if (wallet?.data && token1 && token0) {
      const interval = setInterval(
        () =>
          getPrice(1, wallet.address, token0, token1, signer).then((data: any) => {
            setRatio(data[2])
            setTrade(data[0])
          }),
        5000
      )
      return () => {
        clearInterval(interval)
      }
    }
  }, [token1, token0])
  useEffect(() => {
    if (wallet?.data && token1 && token0) {
      getPrice(token0amount, wallet.address, token0, token1, signer).then((data: any) => {
        setValue('token1', data[1])
      })
    }
  }, [token0amount])

  const onLoad = async () => {
    try {
      const token0Ctr = await getContract(token0.address, signer)
      const token1Ctr = await getContract(token1.address, signer)
      if (wallet.data) {
        await getTokenAmount(wallet.address, token0Ctr, token1Ctr)
      }
    } catch (e) {
      console.log(e, 'err')
    }
  }
  const getTokenAmount = async (address: string, token0Contact: any, token1Contact: any) => {
    setToken0Contract(token0Contact)
    setToken1Contract(token1Contact)
    await token0Contact?.balanceOf(address).then((res: BigNumber) => {
      setToken0({ ...token0, amount: ethers.utils.formatUnits(res, token0.decimals) })
    })
    await token1Contact?.balanceOf(address).then((res: BigNumber) => {
      setToken1({ ...token1, amount: ethers.utils.formatUnits(res, token1.decimals) })
    })
  }

  const handleSwapTokens = () => {
    setToken0(token1)
    setToken1(token0)
    getTokenAmount(wallet.address, token1Contact, token0Contact).then(r => r)
  }

  const onSubmit = handleSubmit(async () => {
    try {
      await runSwap(token0, token0Contact, token0amount, trade, signer)
    } catch (e) {
      console.log(e, 'err')
    }
  })

  return (
    <div>
      <div>
        Total {token0.symbol} : {token0.amount}
      </div>
      <div>
        Total {token1.symbol} : {token1.amount}
      </div>
      <button type="button" onClick={handleSwapTokens}>
        Swap tokens
      </button>
      <form onSubmit={onSubmit} noValidate>
        <div>
          <label>
            <span>U pay {token0.symbol}</span>
            <input
              type="number"
              step={0.0000000000000001}
              placeholder={'Enter amount'}
              defaultValue={1}
              {...register('token0', {
                required: true,
              })}
            />
          </label>
        </div>
        <div>
          <label>
            <span>U get {token1.symbol}</span>
            <input
              type="number"
              step={0.0000000000000001}
              disabled={true}
              {...register('token1', {
                required: true,
              })}
            />
          </label>
        </div>

        <button type="submit">Change</button>
      </form>
      <div className="ratioContainer">
        <div>{Boolean(ratio) && `1 ${token0.symbol} = ${Number(ratio)} ${token1.symbol}`}</div>
      </div>
    </div>
  )
}
