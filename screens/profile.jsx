import {
  View,
  Text,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {setString} from '../utils';
import {useMutation} from '@tanstack/react-query';
import {makeOrder} from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeftStartOnRectangleIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import DropDownSelect from '../components/DropdownSelect';
import Toast from 'react-native-toast-message';
import {useCartContext} from '../context/AppContext';

const Profile = ({navigation}) => {
  const {
    user,
    setIsBiometricsEnabledContext,
    isBiometricsEnabledContext,
    setShouldSync,
  } = useCartContext();
  const [isEnabled, setIsEnabled] = React.useState(
    isBiometricsEnabledContext || false,
  );
  const [loading, setLoading] = useState(false);

  const toggleSwitch = useCallback(async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    setIsBiometricsEnabledContext(newValue);

    try {
      if (newValue) {
        await setString('biometric', true);
      } else {
        await setString('biometric', false);
      }
    } catch (error) {
      console.error('Error updating biometric setting:', error);
    }
  }, [isEnabled, setIsBiometricsEnabledContext]);

  const syncOrders = useCallback(async () => {
    setLoading(true);

    try {
      const existingOrders = await AsyncStorage.getItem('pendingOrders');
      if (!existingOrders) return;

      const orders = JSON.parse(existingOrders);
      const response = await Promise.all(
        orders.map(order => makeOrder(user?.token, order)),
      );
      await Promise.all(response.map(res => res));
      await AsyncStorage.removeItem('pendingOrders');
      setShouldSync(false);
      Toast.show({
        type: 'success',
        text2: 'Orders synced successfully.',
      });
    } catch (error) {
      console.error('Error syncing orders:', error);
      Toast.show({
        type: 'error',
        text2: 'Error creating order. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <View className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <UserIcon size={24} color={'black'} />
            <Text className="font-bold">{user?.user.name}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <ArrowLeftStartOnRectangleIcon size={24} color={'black'} />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center justify-between my-2 mt-4">
          <Text className="text-primary font-bold">Add Biometric Login</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View className="flex-row items-center justify-between my-3 mt-5">
          <Text className="text-primary font-bold">Sync with the Database</Text>
          <TouchableOpacity
            className="bg-primary flex justify-center items-center rounded-full py-2 px-5"
            onPress={syncOrders}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-center font-bold text-white">Sync</Text>
            )}
          </TouchableOpacity>
        </View>
        <View className="my-3 flex flex-row items-center">
          <DropDownSelect />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
