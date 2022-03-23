import {APP_ENV} from '@env';
import {JsonRpcResponse} from '@json-rpc-tools/utils';
import Client from '@walletconnect/client';
import {SessionTypes} from '@walletconnect/types';
import {ethers} from 'ethers';
import React, {createContext, useContext, useState} from 'react';
import {
  DEFAULT_MAIN_CHAINS,
  DEFAULT_RPC_PROVIDER_MAIN,
  DEFAULT_RPC_PROVIDER_TEST,
  DEFAULT_TEST_CHAINS,
} from './constants/default';
import {useWalletconnect} from './hooks/useWalletconnect';

export type Dispatch<T = any> = React.Dispatch<React.SetStateAction<T>>;

export interface IContext {
  loading: boolean;
  chains: string[];
  selectedChain: string;
  provider: ethers.providers.Provider;
  sessions: SessionTypes.Settled[];
  client: Client | undefined;
  closeSessions: () => Promise<void>[];
  closeSession: (topic: string) => Promise<void>;
  consumeEvent: (method: string) => Promise<SessionTypes.RequestEvent>;
  sendResponse: (topic: string, response: JsonRpcResponse<any>) => void;
  pair: (uri: string) => Promise<void>;
}

export const Context = createContext<IContext>(undefined!);
export function useSymfoniContext() {
  return useContext(Context);
}

console.log('APP_ENV:', APP_ENV);

export const ContextProvider = (props: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [chains] = useState<string[]>(
    APP_ENV !== 'prod' ? DEFAULT_TEST_CHAINS : DEFAULT_MAIN_CHAINS,
  );

  const selectedChain =
    APP_ENV !== 'prod' ? DEFAULT_TEST_CHAINS[0] : DEFAULT_MAIN_CHAINS[0];

  const [provider] = useState(
    () =>
      new ethers.providers.JsonRpcProvider({
        url:
          APP_ENV !== 'prod'
            ? DEFAULT_RPC_PROVIDER_TEST
            : DEFAULT_RPC_PROVIDER_MAIN,
      }),
  );

  console.log('chains', chains);
  // const walletconnect = useMemo(() => useWalletconnect(chains), [chains]);
  const walletconnect = useWalletconnect(chains);

  // Make the context object:
  const context: IContext = {
    loading,
    chains,
    provider,
    selectedChain,
    ...walletconnect,
  };

  // pass the value in provider and return
  return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export const {Consumer} = Context;
