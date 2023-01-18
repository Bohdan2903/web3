import React, { useState, useEffect } from 'react'
import Header from 'components/Header'
import Balance from './components/Balance'
import { Login } from './components/Login'
import { Import } from './components/Import'
import { CreatePass } from './components/CreatePass'
import { SwapForm } from './components/SwapForm'

import './App.css'
import { provider } from './utils/vars'
import { ethers } from 'ethers'

const App = () => {
  const [msg, setMsg] = useState('')
  const [wallet, setWallet] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  // const [signer, setSigner] = useState<any>(null)
  const [provider, setProvider] = useState<any>(null)
  const [loginData, setLoginData] = useState<any>(null)

  useEffect(() => {
    const wallets = JSON.parse(String(localStorage.getItem('wallets')))
    if (wallets?.length) {
      setWallet(wallets[0])
      // getSigner()
      if (wallets[0].data) {
        setUser({
          isLogin: false,
        })
      }
    }
  }, [])


  return (
    <div className="App">
      <Header />
      <main>
        <div>
          {!user && wallet && (
            <CreatePass msg={msg} setMsg={setMsg} setWallet={setWallet} loginData={loginData} setUser={setUser} />
          )}
          {user && !user.isLogin && wallet && <Login wallet={wallet} msg={msg} setMsg={setMsg} setUser={setUser} />}

          {wallet && user?.isLogin && (
            <>
              <div>Address: {wallet.address}</div>
              <Balance wallet={wallet} setWallet={setWallet} />
              <SwapForm wallet={wallet} />
            </>
          )}

          {!wallet && <Import msg={msg} setMsg={setMsg} setWallet={setWallet} setLoginData={setLoginData} />}
        </div>
      </main>
    </div>
  )
}

export default App