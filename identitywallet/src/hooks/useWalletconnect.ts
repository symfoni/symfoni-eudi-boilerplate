/* eslint-disable no-undef */
import {JsonRpcResponse} from '@json-rpc-tools/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CLIENT_EVENTS,
  default as Client,
  default as WalletConnectClient,
} from '@walletconnect/client';
import {SessionTypes} from '@walletconnect/types';
import {ethers} from 'ethers';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  DEFAULT_APP_METADATA,
  DEFAULT_EIP155_METHODS,
  DEFAULT_PROJECT_ID,
  DEFAULT_RELAY_PROVIDER,
} from './../constants/default';

export const useWalletconnect = (supportedChains: string[]) => {
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [sessions, setSessions] = useState<SessionTypes.Settled[]>([]);

  // Handle requests
  const requestResolvers = useRef(
    new Map<string, (event: SessionTypes.RequestEvent) => void>(),
  );

  const consumeEvent = (method: string) => {
    console.info(`useWalletConnect.ts: Subscribed to request: ${method}`);
    return new Promise<SessionTypes.RequestEvent>(resolve => {
      requestResolvers.current.set(method, resolve);
    });
  };

  const handleRequest = useCallback((event: SessionTypes.RequestEvent) => {
    console.log('event', event);
    console.info(
      'useWalletConnect.ts: handleRequest(): ',
      event.request.method,
    );
    requestResolvers.current.get(event.request.method)?.(event);
    requestResolvers.current.delete(event.request.method);
  }, []);

  // Init Walletconnect client
  useEffect(() => {
    const initClient = async () => {
      try {
        console.log(`Starting Client...`);

        const _client = await WalletConnectClient.init({
          controller: true,
          projectId: DEFAULT_PROJECT_ID,
          relayUrl: DEFAULT_RELAY_PROVIDER,
          metadata: DEFAULT_APP_METADATA,
          storageOptions: {
            asyncStorage: AsyncStorage as any,
            tableName: 'test-1',
          },
        });

        console.log('Client started!');
        setClient(_client);
      } catch (e) {
        console.log('Failed to start Client!');
        console.warn(e);
      }
    };
    initClient();
    return () => {
      console.log('Destroyed client');
    };
  }, []);

  const pair = useCallback(
    async (uri: string) => {
      console.log(`pair(): Uri: ${uri}`);
      const pairResult = await client?.pair({uri: uri});
      console.log('pari', pairResult);
      console.log('PairResult', pairResult);
    },
    [client],
  );

  const sendResponse = (topic: string, response: JsonRpcResponse<any>) => {
    if (!client) {
      console.warn('useWalletConnect(): sendResponse: !client');
      return;
    }
    client?.respond({topic, response});
  };

  const handlePruposal = useCallback(
    async (proposal: SessionTypes.Proposal) => {
      console.log('Received PROPOSAL: ', proposal);
      // Approve connection
      if (typeof client === 'undefined') {
        console.warn(`handleProposal: typeof client === "undefined"`);
        return;
      }

      const unsupportedChains: string[] = [];
      proposal.permissions.blockchain.chains.forEach(chainId => {
        if (supportedChains.includes(chainId)) {
          return;
        }
        unsupportedChains.push(chainId);
      });
      if (unsupportedChains.length) {
        console.warn(`handleProposal: unsupportedChains.length`);
        return client.reject({
          proposal,
          reason: {
            code: 0,
            message: `Unsupported chain ${unsupportedChains.join(',')}`,
          },
        });
      }
      const unsupportedMethods: string[] = [];
      proposal.permissions.jsonrpc.methods.forEach(method => {
        if (DEFAULT_EIP155_METHODS.includes(method)) {
          return;
        }
        unsupportedMethods.push(method);
      });
      if (unsupportedMethods.length) {
        console.warn(`handleProposal: unsupportedMethods.length`);

        return client.reject({
          proposal,
          reason: {
            code: 0,
            message: `Unsupported method ${unsupportedMethods.join(',')}`,
          },
        });
      }

      // Approve connection
      if (typeof client === 'undefined') {
        console.warn(`handleProposal: typeof client === "undefined"`);
        return;
      }

      const mnemnonic = await client.storage.keyValueStorage.getItem<string>(
        'mnemnonic',
      );

      let address: string;
      if (mnemnonic === undefined) {
        const wallet = ethers.Wallet.createRandom();
        address = wallet.address;
        await client.storage.keyValueStorage.setItem(
          'mnemnonic',
          wallet.mnemonic.phrase,
        );
        console.log('address mnemnonic is undefind', address);
      } else {
        console.log(
          'is not undefined so get address from mnemnonic',
          mnemnonic,
        );
        address = await ethers.Wallet.fromMnemonic(mnemnonic).address;
      }

      const response = {
        state: {accounts: [`eip155:421611:${address}`]},
      };

      console.log('response', response);
      try {
        await client.approve({proposal, response});
      } catch (e: any) {
        console.warn('handlePropsal: await approval failed with errir', e);
      }
    },
    [supportedChains, client],
  );

  // Sessions
  useEffect(() => {
    setSessions(client?.session.values ?? []);
    const updateSessions = () => {
      setSessions(client?.session.values ?? []);
    };
    client?.on(CLIENT_EVENTS.session.sync, updateSessions);
    client?.on(CLIENT_EVENTS.session.created, updateSessions);
    client?.on(CLIENT_EVENTS.session.deleted, updateSessions);
    client?.on(CLIENT_EVENTS.session.updated, updateSessions);
    client?.on(CLIENT_EVENTS.pairing.created, updateSessions);
    client?.on(CLIENT_EVENTS.pairing.deleted, updateSessions);

    return () => {
      client?.off(CLIENT_EVENTS.session.sync, updateSessions);
      client?.off(CLIENT_EVENTS.session.created, updateSessions);
      client?.off(CLIENT_EVENTS.session.updated, updateSessions);
      client?.off(CLIENT_EVENTS.session.deleted, updateSessions);
      client?.off(CLIENT_EVENTS.pairing.created, updateSessions);
      client?.off(CLIENT_EVENTS.pairing.deleted, updateSessions);
    };
  }, [client]);

  const closeSession = useCallback(
    async (topic: string) => {
      const disconnectParams = {
        topic: topic,
        reason: {
          message: 'User closed session from app.',
          code: 123,
        },
      };
      if (!client) {
        throw new Error('Client is not initialized');
      }

      client.disconnect(disconnectParams);
    },
    [client],
  );

  const closeSessions = useCallback(
    () => sessions.map(session => closeSession(session.topic)),
    [sessions, closeSession],
  );

  // Subscribe / Unsubscribe Walletconnect
  useEffect(() => {
    const subscribeClient = async () => {
      try {
        if (!client) {
          return;
        }
        console.log('Subscribiing Client...');
        client.on(CLIENT_EVENTS.session.proposal, handlePruposal);
        client.on(CLIENT_EVENTS.session.request, handleRequest);
        console.log('Subscribed pruposal');
        console.log('Subscribed request');
      } catch (e) {
        console.log('Failed to subscribe Client!');
        console.warn(e);
      }
    };
    subscribeClient();
    return () => {
      if (client) {
        client.removeListener(CLIENT_EVENTS.session.proposal, handlePruposal);
        client.removeListener(CLIENT_EVENTS.session.request, handleRequest);
      }
      console.log('Destroyed subscribe');
    };
  }, [client, handlePruposal, handleRequest]);

  return {
    sessions,
    client,
    consumeEvent,
    closeSession,
    closeSessions,
    pair,
    sendResponse,
  };
};
