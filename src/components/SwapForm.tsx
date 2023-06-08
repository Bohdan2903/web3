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
    const token1amount = watch('token1')

    useEffect(() => {
        if (wallet.data) {
            onLoad().then(r => r)
        }
    }, [])

    useEffect(() => {
        if (wallet?.data && token1 && token0) {
            const interval = setInterval(
                () =>
                    getPrice(token0amount, wallet.address, token0, token1, signer).then((data: any) => {
                        console.log(data, 'data')
                        setRatio(data[2])
                        setTrade(data[0])
                        if (token1amount !== data[1]) {
                            setValue('token1', data[1])
                        }
                    }),
                2000
            )
            return () => {
                clearInterval(interval)
            }
        }
    }, [token1, token0, token0amount])


    const onLoad = async () => {
        try {
            const token0Ctr = await getContract(token0.address)
            const token1Ctr = await getContract(token1.address)
            if (wallet.data) {
                await getTokenAmount(wallet.address, token0Ctr, token1Ctr)
            }
        } catch (e) {
            console.log(e, 'err')
        }
    }
    const getTokenAmount = async (address: string, token0Contact: any, token1Contact: any, isSwap = false) => {

        const mainToken = isSwap ? token1 : token0
        const secondToken = isSwap ? token0 : token1
        const mainContract = isSwap ? token1Contact : token0Contact
        const secondContract = isSwap ? token0Contact : token1Contact
        setToken0Contract(mainContract)
        setToken1Contract(secondContract)
        await mainContract?.balanceOf(address).then((res: BigNumber) => {
            setToken0({ ...mainToken, amount: ethers.utils.formatUnits(res, mainToken.decimals) })
        })
        await secondContract?.balanceOf(address).then((res: BigNumber) => {
            setToken1({ ...secondToken, amount: ethers.utils.formatUnits(res, secondToken.decimals) })
        })
    }

    const handleSwapTokens = () => {
        getTokenAmount(wallet.address, token0Contact, token1Contact, true).then(r => r)
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
            {ratio && (
                <div className="ratioContainer">
                    <div>{`1 ${token0.symbol} = ${ratio} ${token1.symbol}`}</div>
                </div>
            )}

        </div>
    )
}
