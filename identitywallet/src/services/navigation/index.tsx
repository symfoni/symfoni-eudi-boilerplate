import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CredentialsScreen from '@screens/credentials/CredentialsScreen';
import IncrementNumber from '@screens/scanner/IncrementNumber';
import HomeScreen from '@screens/scanner/ScannerScreen';
import SignMessageScreen from '@screens/scanner/SignMessageScreen';
/**
 * ? Local & Shared Imports
 */
import {SCREENS} from '@shared-constants';
import {DarkTheme, LightTheme, palette} from '@theme/themes';
import React from 'react';
import {useColorScheme} from 'react-native';
import {isReadyRef, navigationRef} from 'react-navigation-helpers';

// ? If you want to use stack or tab or both
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Navigation = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  React.useEffect((): any => {
    return () => (isReadyRef.current = false);
  }, []);

  const RenderTabNavigation = () => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarActiveTintColor: palette.primary,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: isDarkMode ? palette.black : palette.white,
          },
        })}>
        <Tab.Screen name={SCREENS.MAIN} component={HomeScreen} />
        <Tab.Screen name={SCREENS.CREDENTIALS} component={CredentialsScreen} />
        <Tab.Screen
          name={SCREENS.INCREMENT_NUMBER}
          component={IncrementNumber}
        />
        <Tab.Screen name={SCREENS.SIGN} component={SignMessageScreen} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      theme={isDarkMode ? DarkTheme : LightTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={SCREENS.MAIN} component={RenderTabNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
