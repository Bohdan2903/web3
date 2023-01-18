import React from "react";
import { ethers } from "ethers";
import { addressValidate } from "../utils/addressValidate";
import { useForm } from "react-hook-form";

export const Login = ({wallet,msg, setMsg, setUser}:any) => {
  const useFormProps = useForm()
  const { handleSubmit, register } = useFormProps

  const connectUser = handleSubmit(async (data: any) => {
    try {
      const decrypt = await ethers.Wallet.fromEncryptedJsonSync(wallet.data, data.passwordLogin)
      console.log(decrypt, 'decrypt')
      if (decrypt?.address) {
        setUser({ address: addressValidate(decrypt.address), isLogin: true })
      }
    } catch (e) {
      console.log(e, 'error')
      setMsg('incorrect pass ')
    }
  })
  return(
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
