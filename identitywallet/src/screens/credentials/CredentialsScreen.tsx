import React, {useMemo} from 'react';
import {View, StyleProp, ViewStyle, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
/**
 * ? Local Imports
 */
import createStyles from './CredentialsScreen.style';

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ICredentialsScreenProps {
  style?: CustomStyleProp;
}

const CredentialsScreen: React.FC<ICredentialsScreenProps> = ({style}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text>Search</Text>
    </View>
  );
};

export default CredentialsScreen;
