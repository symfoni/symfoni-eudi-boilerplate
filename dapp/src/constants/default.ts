export const DEFAULT_MAIN_CHAINS = [
  // mainnets
  // "eip155:1",
  // "eip155:10",
  // "eip155:100",
  // "eip155:137",
  "eip155:42161",
  // "eip155:42220",
];

export const DEFAULT_TEST_CHAINS = [
  // testnets
  // "eip155:42",
  // "eip155:69",
  // "eip155:80001",
  "eip155:421611",
  // "eip155:44787",
];

export const DEFAULT_CHAINS = [...DEFAULT_MAIN_CHAINS, ...DEFAULT_TEST_CHAINS];

export const DEFAULT_PROJECT_ID = process.env.REACT_APP_PROJECT_ID;

export const DEFAULT_INFURA_ID = process.env.REACT_APP_INFURA_ID;

export const DEFAULT_RELAY_URL = process.env.REACT_APP_RELAY_URL;

export const DEFAULT_EIP155_METHODS = ["eth_sendTransaction", "personal_sign", "eth_signTypedData"];

export const DEFAULT_WALLETCONNECT_METHODS = ["test_increment", "test_sign", "test_saveId"];

export const DEFAULT_LOGGER = "debug";

export type ProviderTypes = "hardhat" | "walletConnect" | "web3modal";
export const PROVIDERS = ["hardhat", "walletConnect", "web3modal"];
export const DEFAULT_PROVIDER = "walletConnect";

export type SignerTypes = "walletConnect" | "mnemonic" | "prompt" | "web3modal";
export const SIGNERS = ["walletConnect", "mnemonic", "prompt", "web3modal"];
export const DEFAULT_SIGNER = "walletConnect";

export const CHAIN_ID = 421611;

export const DEFAULT_APP_METADATA = {
  name: "React App",
  description: "React App for WalletConnect",
  url: "https://walletconnect.com/",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const WALLETCONNECT_METADATA = {
  icons: [
    "https://uploads-ssl.webflow.com/5fca7279f4f9241d2b0e90ae/60ddc0d0a40f8ed13b785fff_2021%20dark%20bg.png",
  ],
  description: "Dette er en dapp for test og hygge",
  name: "Symfoni dApp",
  url: "https://www.symfoni.dev",
};
