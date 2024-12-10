/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import './global.css';
import Toast from 'react-native-toast-message';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import AppNavigator from './appNavigator';
import AppContext from './context/AppContext';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>
      {/* <SafeAreaView style={backgroundStyle} className="flex-1"> */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <QueryClientProvider client={queryClient}>
        <AppContext>
          <AppNavigator />
        </AppContext>
      </QueryClientProvider>
      {/* </SafeAreaView> */}
      <Toast />
    </>
  );
}

export default App;
