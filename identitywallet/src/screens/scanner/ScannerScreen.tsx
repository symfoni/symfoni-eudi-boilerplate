import {useTheme} from '@react-navigation/native';
import {Scanner} from 'components/Scanner';
import {useSymfoniContext} from 'context';
import React, {useCallback, useMemo, useState} from 'react';
import {Button, StyleProp, Text, View, ViewStyle} from 'react-native';
import {warn} from 'shared/utils';
/**
 * ? Local Imports
 */
import createStyles from './ScannerScreen.style';

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IScannerScreenProps {
  style?: CustomStyleProp;
}

const ScannerScreen: React.FC<IScannerScreenProps> = ({style}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {pair, loading, closeSessions, sessions, consumeEvent} =
    useSymfoniContext();

  // Sessions
  const onCloseSessions = useCallback(async () => {
    await Promise.all(closeSessions());
  }, [closeSessions]);

  const [scannerVisible, setScannerVisible] = useState(true);

  // QR
  const onScanQR = useCallback(
    async (maybeURI: any) => {
      console.log('onRead', maybeURI);

      // 1. Validate URI
      if (typeof maybeURI !== 'string') {
        console.info("typeof maybeURI !== 'string': ", maybeURI);
        return;
      }
      if (!maybeURI.startsWith('wc:')) {
        console.info("!maybeURI.startsWith('wc:'): ", maybeURI);
        return;
      }

      const URI = maybeURI;

      // 2. Pair
      try {
        await pair(URI);
      } catch (err) {
        warn('SCANNERSCREEN', 'onScanQR', err);

        return;
      }
      setScannerVisible(false);
    },
    [pair],
  );

  console.log('sessions length', sessions.length);

  return (
    <View style={styles.container}>
      {scannerVisible && <Scanner onInput={onScanQR} />}
      <Button
        title={scannerVisible ? 'Hide QR-scanner' : 'Show QR-scanner'}
        onPress={() => setScannerVisible(!scannerVisible)}
      />
      <View>
        <Text>Du har {sessions.length} aktiv tilkobling</Text>
        <Button title={`Koble fra`} onPress={onCloseSessions} />
      </View>
    </View>
  );
};

export default ScannerScreen;
