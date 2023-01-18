import React, { useState } from 'react'
import { addressValidate } from '../utils/addressValidate'
import { ethers } from 'ethers'
import { useForm } from 'react-hook-form'

export const Import = ({ msg, setMsg, setWallet, setLoginData }: any) => {
  const useFormProps = useForm()
  const { handleSubmit, register } = useFormProps
  const [byKey, setByKey] = useState(true)
  const connectWallet = handleSubmit((data: any) => {
    try {
      const wallets = JSON.parse(String(localStorage.getItem('wallets')))
      const privateKey: string = addressValidate(data.privateKey)
      const wallet = byKey ? new ethers.Wallet(privateKey) : ethers.Wallet.fromMnemonic(data.seedPhrase)
      const walletFound = wallets?.find(
        (elem: any) => addressValidate(elem.address.toLowerCase()) === addressValidate(wallet.address.toLowerCase())
      )
      const walletData = { ...wallet, balance: null, value: null }
      if (wallet) {
        setLoginData({ ...data })
        setWallet(walletData)
        !walletFound && localStorage.setItem('wallets', JSON.stringify([walletData]))
        setMsg('')
      } else {
        setMsg('wallet is not connected')
      }
    } catch (e) {
      console.log(e)
      setMsg('wallet is not connected')
    }
  })

  return (
    <>
      <div>
        <label>
          <input type="radio" name={'connect'} value={'key'} onChange={() => setByKey(true)} defaultChecked={true} />
          Private Key
        </label>
        <label>
          <input type="radio" name={'connect'} value={'seed'} onChange={() => setByKey(false)} />
          Seed Phrase
        </label>
      </div>
      <form onSubmit={connectWallet} noValidate>
        <div>
          {byKey ? (
            <input
              type="text"
              placeholder={'private key'}
              {...register('privateKey', {
                required: true,
              })}
            />
          ) : (
            <input
              type="text"
              placeholder={'seed phrase'}
              {...register('seedPhrase', {
                required: true,
              })}
            />
          )}
        </div>
        <button className="btn" type="submit">
          Connect Wallet
        </button>
      </form>
      {msg && <p>{msg}</p>}
    </>
  )
}
