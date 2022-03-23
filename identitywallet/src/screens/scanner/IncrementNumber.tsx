import {useTheme} from '@react-navigation/native';
import {useSymfoniContext} from 'context';
import React, {useMemo, useState} from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import useAsyncEffect from 'use-async-effect';
/**
 * ? Local Imports
 */
import createStyles from './ScannerScreen.style';

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IScannerScreenProps {
  style?: CustomStyleProp;
}

const IncrementNumberScreen: React.FC<IScannerScreenProps> = ({style}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {consumeEvent, client} = useSymfoniContext();

  const [scannerVisible, setScannerVisible] = useState(true);
  const [testNum, setTestNum] = useState(0);

  useAsyncEffect(async isMounted => {
    while (client) {
      const {topic, request} = await consumeEvent('test_increment');
      console.log('topic', topic);
      console.log('request', request);

      if (isMounted()) {
        setTestNum(() => testNum + 1);
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>Nummer som oppdateres fra Dapp er:</Text>
      <Text>{testNum}</Text>
    </View>
  );
};

export default IncrementNumberScreen;
