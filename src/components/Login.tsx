import React from 'react'
import { ethers } from 'ethers'
import { addressValidate } from '../utils/addressValidate'
import { useForm } from 'react-hook-form'
import { provider } from '../utils/vars'

export const Login = ({ wallet, msg, setMsg, setUser, setSigner }: any) => {
  const useFormProps = useForm()
  const { handleSubmit, register } = useFormProps

  const connectUser = handleSubmit(async (data: any) => {
    try {
      const decryptWallet = await ethers.Wallet.fromEncryptedJsonSync(wallet.data, data.passwordLogin)
      const signer = await decryptWallet.connect(provider)
      if (decryptWallet?.address) {
        setUser({ address: addressValidate(decryptWallet.address), isLogin: true })
        setSigner(signer)
      }
    } catch (e) {
      console.log(e, 'error')
      setMsg('incorrect pass ')
    }
  })
  return (
    <>
      <form onSubmit={connectUser} noValidate>
        <div>
          <input
            type="password"
            placeholder={'password'}
            {...register('passwordLogin', {
              required: true,
            })}
          />
        </div>
        <button className="btn" type="submit">
          Log in
        </button>
      </form>
      {msg && <p>{msg}</p>}
    </>
  )
}
