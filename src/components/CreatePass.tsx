import React from 'react'
import { ethers } from 'ethers'
import { optionsCrypt } from '../utils/vars'
import { useForm } from 'react-hook-form'

export const CreatePass = ({ loginData, msg, setMsg, setWallet, setUser }: any) => {
  const useFormProps = useForm()
  const { handleSubmit, register } = useFormProps

  const createPass = handleSubmit(async (data: any) => {
    if (!loginData) {
      setWallet(null)
      localStorage.removeItem('wallets')
    }
    let wallet, encrypt, dataEncrypted
    try {
      wallet = loginData.privateKey
        ? await new ethers.Wallet(loginData.privateKey)
        : await ethers.Wallet.fromMnemonic(loginData.seedPhrase)
      await wallet.encrypt(data.password, optionsCrypt).then(json => (dataEncrypted = json))

      setWallet({
        ...wallet,
        balance: null,
        value: null,
        data: dataEncrypted,
      })
      localStorage.setItem(
        'wallets',
        JSON.stringify([
          {
            ...wallet,
            balance: null,
            value: null,
            data: dataEncrypted,
          },
        ])
      )
      setUser({
        isLogin: false,
      })
    } catch (e) {
      console.log(e)
      setMsg('Error ')
    }
  })
  return (
    <>
      <form onSubmit={createPass} noValidate>
        <div>
          <input
            type="password"
            placeholder={'password'}
            {...register('password', {
              required: true,
            })}
          />
        </div>
        <button className="btn" type="submit">
          Create password
        </button>
      </form>
      {msg && <p>{msg}</p>}
    </>
  )
}
