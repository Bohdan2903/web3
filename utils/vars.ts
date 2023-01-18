import { ethers } from 'ethers'

//https://rpc.ankr.com/eth_rinkeby
// Chain ID - 5

// export const TEMP_PRIVATE_KEY_2 = '0xc4bdfb4c376785a2aa7d6e21166354b0ed17e716c59607ce15f23bd0e88508be'
// export const TEMP_PRIVATE_KEY = '0xd542ea3d2bbf8870e12750795c9615f5ec04d6c4357ac82aaa772aad55601169'
// export const TEMP_SEED = 'gasp captain pencil divorce blame improve couple aim merge magnet permit ice'
export const SWAP_ADDRESS = '0x6988931d520D3A091F7C61b615CFF743280586cd'

export const CHAIN_ID = 5
export const InfuraApi = 'https://goerli.infura.io/v3/'
export const provider = new ethers.providers.InfuraProvider('goerli', 'e811642551144f67a32a24b4442f0c09')


export const optionsCrypt = {
  scrypt: {
    N: 1 << 16,
  },
}

export const goerliWETH = {
  name: 'Wrapped Ether',
  address: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
  symbol: 'WETH',
  decimals: 18,
  chainId: 5,
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
}
export const goerliUSDC = {
  name: 'USD Coin USDC',
  address: '0x3a034fe373b6304f98b7a24a3f21c958946d4075',
  symbol: 'USDC',
  decimals: 6,
  chainId: 5,
  logoURI: 'https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_USDC.svg',
}

export const ERC20ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'version',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_extraData',
        type: 'bytes',
      },
    ],
    name: 'approveAndCall',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: 'remaining',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    inputs: [
      {
        name: '_initialAmount',
        type: 'uint256',
      },
      {
        name: '_tokenName',
        type: 'string',
      },
      {
        name: '_decimalUnits',
        type: 'uint8',
      },
      {
        name: '_tokenSymbol',
        type: 'string',
      },
    ],
    type: 'constructor',
  },
  {
    payable: false,
    type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_from',
        type: 'address',
      },
      {
        indexed: true,
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_owner',
        type: 'address',
      },
      {
        indexed: true,
        name: '_spender',
        type: 'address',
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
]
