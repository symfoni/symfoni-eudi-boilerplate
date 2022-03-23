# VC issuer, verifier and holder

This project demonstrate the usage of WalletConnect, Veramo with the use of React Native, Nestjs and React.

## Get started

do `npm install`in `backend`, `dapp`and ìdentitywallet

Run backend
`cd backend `
`npm start:dev`

Open new terminal and run dapp
`cd dapp`
`npm start`

Open new terminal and run Identitywallet
`cd identitywallet`
`npm run ios` for ios-simualtor or `npm run android` for androd simulator

### Note
Walletconnect2 is in beta and there is a bug which crashes dapp and identitywallet. When this happen:
- clear browser cache/storage or run in fresh browser(e.g. igcognito)
- uninstall identitywallet from simulator device 

This can cause some frustration when developing! Caution. 

Link to walletconnect issue is here: https://github.com/WalletConnect/walletconnect-monorepo/issues/625

## Backend
Nestjs Typescript

**Feature**
- Issues a Identity Credential in exhange for a social security number
- Veramo issuer and verifier

## Dapp
React Typescript

**Feature**
- Connect to an Identity wallet with WalletConnect
- Interact with backend by sending social security number and get a IdentityCredential to your Identity Wallet
- Demonstrate interaction dapp/wallet

## Identity wallet
React Native Typescript, Walletconnect

**Feature**
- Sign, save and issue credentials
- Use walletconnect to create sessions with a dapp
