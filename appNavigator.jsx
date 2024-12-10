import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './screens/login';
import Home from './screens/home';
import Details from './screens/details';
import {useCartContext} from './context/AppContext';
import BottomCart from './components/BottomCart';
import Search from './screens/search';
import Cart from './screens/cart';
import Gateway from './screens/gateway';

const Stack = createNativeStackNavigator();

function RootStack() {
  const {cartStore} = useCartContext();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Group
        screenLayout={({children}) => (
          <>
            {children}
            {cartStore?.length > 0 && <BottomCart />}
          </>
        )}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Search" component={Search} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Gateway" component={Gateway} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default AppNavigator;
