export const DEFAULT_APP_METADATA = {
  name: 'Identity Wallet',
  description: 'Identity Wallet from Symfoni',
  url: 'https://walletconnect.org/',
  icons: ['https://walletconnect.org/walletconnect-logo.png'],
};

export const DEFAULT_MAIN_CHAINS = ['eip155:42161'];

export const DEFAULT_TEST_CHAINS = ['eip155:421611'];

export const DEFAULT_CHAINS = [...DEFAULT_MAIN_CHAINS, ...DEFAULT_TEST_CHAINS];

export const DEFAULT_RELAY_PROVIDER = 'wss://relay.walletconnect.com'; // "wss://localhost:5555"

export const DEFAULT_PROJECT_ID = '9f8d02f562e4e4abce097a44ff713243';

export const DEFAULT_RPC_PROVIDER_TEST =
  'https://arb-rinkeby.g.alchemy.com/v2/_oMAKsLfMlE5OrHhjUPdBiV-8bKnpGXW';
export const DEFAULT_RPC_PROVIDER_MAIN = 'SET THIS UP!!!!';

export const DEFAULT_EIP155_METHODS = [
  'test_sign',
  'test_increment',
  'test_saveId',
];

// export const DEFAULT_EIP155_METHODS = [
//   // "eth_sendTransaction",
//   // "personal_sign",
//   // "eth_signTypedData",
//   // "eth_signTransaction",
//   'symfoniID_createCapTableVP',
//   'symfoniID_capTablePrivateTokenTransferVP',
//   'symfoniID_accessVP',
//   'symfoniID_capTableClaimToken',
//   'symfoniID_updateShareholderVP',
// ];

export const DEFAULT_LOGGER = 'debug';
