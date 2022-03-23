import {SessionTypes} from '@walletconnect/types';
import {useSymfoniContext} from 'context';
import React, {useState} from 'react';
import useAsyncEffect from 'use-async-effect';
import {RequestModal} from './modal/RequestModal';

// Local

export const Requests = () => {
  const {consumeEvent, client, sendResponse} = useSymfoniContext();
  const [request, setRequest] = useState<
    SessionTypes.RequestEvent | undefined
  >();

  console.log('in requests');

  useAsyncEffect(async isMounted => {
    while (client) {
      console.log('hello', client);
      const request = await consumeEvent('test_saveId');
      console.log('request', request);
      setRequest(request);
    }
  });

  const confirmSave = async () => {
    if (request === undefined) {
      console.log('request is undefined. Should not happen');
      return;
    }
    await sendResponse(request.topic, {
      result: {true: true},
      id: request.request.id,
      jsonrpc: request.request.jsonrpc,
    });
    setRequest(undefined);
  };

  const reject = async () => {
    if (request === undefined) {
      console.log('request is undefined. Should not happen');
      return;
    }
    await sendResponse(request.topic, {
      id: request.request.id,
      jsonrpc: request.request.jsonrpc,
      error: {
        code: 1,
        message: 'Rejected by user',
      },
    });
  };

  return (
    <>
      {request && (
        <RequestModal
          request={request}
          onApprove={confirmSave}
          onReject={reject}
        />
      )}
    </>
  );
};
