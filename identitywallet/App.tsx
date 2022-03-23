/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {Requests} from 'components/Requests';
import {ContextProvider} from 'context';
import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import Toast from 'react-native-toast-message';
import Navigation from './src/services/navigation';

const App = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  React.useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
  }, [scheme]);

  return (
    <>
      <ContextProvider>
        <Navigation />
        <Toast ref={ref => Toast.setRef(ref)} />
        <Requests />
      </ContextProvider>
    </>
  );
};

export default App;
