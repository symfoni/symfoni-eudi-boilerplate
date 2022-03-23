import {JsonRpcRequest} from '@json-rpc-tools/utils';
import {useTheme} from '@react-navigation/native';
import {useSymfoniContext} from 'context';
import React, {useMemo, useState} from 'react';
import {Button, StyleProp, Text, View, ViewStyle} from 'react-native';
import useAsyncEffect from 'use-async-effect';
/**
 * ? Local Imports
 */
import createStyles from './ScannerScreen.style';

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IScannerScreenProps {
  style?: CustomStyleProp;
}

const SignMessageScreen: React.FC<IScannerScreenProps> = ({style}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {consumeEvent, client, sendResponse} = useSymfoniContext();
  const [request, setRequest] = useState<JsonRpcRequest | undefined>();
  const [topic, setTopic] = useState('');
  const [messageToSign, setMessageToSign] = useState('');

  useAsyncEffect(async isMounted => {
    while (client) {
      const {topic, request} = await consumeEvent('test_sign');
      console.log('topic', topic);
      console.log('request', request);
      setRequest(request);
      setTopic(topic);
      // setMessageToSign(request?.params[0]?.messageToSign);
    }
  }, []);

  const sign = async () => {
    await sendResponse(topic, {
      result: messageToSign,
      id: request!!.id,
      jsonrpc: '',
    });
  };

  return (
    <View style={styles.container}>
      {!request && (
        <Text>Gå til dapp for å sende melding som ønskes signert</Text>
      )}
      {request && (
        <View>
          <Text>{JSON.stringify(request)}</Text>
          <Text>You have a pending message to sign. Message is:</Text>
          <Text>{request?.params[0]?.messageToSign}</Text>
          <Button onPress={() => sign()} title="Sign message"></Button>
        </View>
      )}
      <Text></Text>
    </View>
  );
};

export default SignMessageScreen;
