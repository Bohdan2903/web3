import React, { useEffect } from 'react'
import { getBalance } from '../utils/getBalance'

const Balance = ({ wallet, setWallet }: any) => {
    useEffect(() => {
        const getCurrBalance = async () => {
            const balance: any = await getBalance(wallet.address)
            setWallet({
                ...wallet,
                balance,
            })
        }

        getCurrBalance().then(r => r)
    }, [])

    return (
        <div>
            <p>balance: {Number(wallet?.balance).toFixed(6) || 0} ETH</p>
        </div>
    )
}
export default Balance
