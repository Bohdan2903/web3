import React, { useEffect } from 'react'
import { getBalance } from '../utils/getBalance'

const Balance = ({ wallet, setWallet }: any) => {
  const { balance, address } = wallet
  // @ts-ignore
  useEffect(() => {
    // @ts-ignore
    // prettier-ignore
    (async () => {
      if (wallet?.address) {
        const balance: any = await getBalance(address)
        setWallet({
          ...wallet,
          balance,
        })
      }
    })()
  }, [])

  return (
    <div>
      <p>balance: {balance} ETH</p>
    </div>
  )
}
export default Balance
