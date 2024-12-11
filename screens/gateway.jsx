import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Switch,
  FlatList,
} from 'react-native';
import React, {useEffect} from 'react';
import EventSource from 'react-native-sse';
import {useCartContext} from '../context/AppContext';
import {useMutation} from '@tanstack/react-query';
import {makeOrder, sendSTKPush} from '../services';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PayoutCard from '../components/PayoutCard';

const Gateway = ({navigation}) => {
  const [isMpesa, setIsMpesa] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [phone, setPhone] = React.useState('');
  const [merchantId, setMerchantId] = React.useState('');
  const {cartStore, isConnected, user, removeFromCartStore} = useCartContext();

  const total = cartStore?.reduce(
    (acc, curr) => acc + curr.sale_price * curr.quantity,
    0,
  );

  const mutation = useMutation({
    mutationFn: ({tk, arr}) => makeOrder(tk, arr),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text2: 'Order created successfully',
      });

      removeFromCartStore();
      navigation.navigate('Home');
    },
    onError: error => {
      console.log('error order', error);
      Toast.show({
        type: 'error',
        text2: 'Error creating order. Please try again.',
      });
    },
  });

  const saveOrderOffline = async orderData => {
    try {
      const existingOrders = await AsyncStorage.getItem('pendingOrders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(orderData);
      await AsyncStorage.setItem('pendingOrders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving order offline:', error);
    }
  };

  const handleMpesaPay = async () => {
    if (!phone) {
      Toast.show({
        type: 'error',
        text2: 'Please enter your client phone.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await sendSTKPush(phone, total);
      if (response?.Description) {
        Toast.show({
          type: 'success',
          text2: response?.Description,
        });
        setMerchantId(response?.MerchantRequestID);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: 'Error sending STK Push. Please try again.',
      });
      console.log('pay error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processOrder = async () => {
    setIsLoading(true);
    const orderData = {cart_products: cartStore};
    if (isConnected) {
      mutation.mutate({tk: user?.token, arr: orderData});
    } else {
      await saveOrderOffline(orderData);
      Toast.show({
        type: 'success',
        text2: 'Order saved locally. Will sync when online',
      });
      removeFromCartStore();
      navigation.navigate('Home');
    }
    setIsLoading(false);
  };

  const handleSubmit = () => {
    if (isMpesa) {
      handleMpesaPay();
    } else {
      processOrder();
    }
  };

  useEffect(() => {
    if (merchantId) {
      const eventSource = new EventSource(
        `https://demo.paysokoerp.com/api/pos/stk-stream-status?merchant_request_id=${merchantId}`,
      );
      eventSource.addEventListener('message', e => {
        if (e.data === 'END-OF-STREAM') {
          eventSource.close();
          Toast.show({
            type: 'error',
            text2: 'The payment failed due to an unknown error',
          });
          setMerchantId('');
        }

        if (e.data === '0' && e.data !== '') {
          eventSource.close();
          Toast.show({
            type: 'success',
            text2: 'The payment has been successfully made',
          });
          setMerchantId('');
          let obj = {
            cart_products: cartStore,
          };
          mutation.mutate({tk: user?.token, arr: obj});
        }

        if (e.data === '1032') {
          eventSource.close();
          Toast.show({
            type: 'error',
            text2: 'You cancelled the payment, please try again',
          });
          setMerchantId('');
        }

        if (e.data === '1037') {
          eventSource.close();
          Toast.show({
            type: 'error',
            text2: 'The payment failed due to payment response timeout',
          });
          setMerchantId('');
        }

        if (e.data === '2001') {
          eventSource.close();
          Toast.show({
            type: 'error',
            text2:
              'Something went wrong; you might have entered a wrong PIN,try again',
          });
          setMerchantId('');
        }
        if (e.data === 'NULL') {
          eventSource.close();
          Toast.show({
            type: 'error',
            text2: 'The payment failed due to an unknown error',
          });
          setMerchantId('');
        }
      });

      return () => {
        eventSource.close();
      };
    }
  }, [merchantId]);

  return (
    <View className="flex-1 bg-secondary">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-3 mt-4">
          <Text className="font-bold text-2xl text-gray-600">Payout</Text>
          <View className="flex-1 mt-2 py-3">
            <FlatList
              data={cartStore}
              renderItem={({item}) => <PayoutCard item={item} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <View className="px-3 py-2 border-t border-gray-300">
            <View className="flex-row items-center justify-between my-2 mt-4">
              <Text className="text-primary font-bold">Pay with MPESA</Text>
              <Switch
                trackColor={{false: '#767577', true: '#363636'}}
                thumbColor={isMpesa ? '#FE9C42' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setIsMpesa}
                value={isMpesa}
              />
            </View>
            {isMpesa && (
              <TextInput
                placeholder="Phone number.."
                className="border border-gray-400 w-full p-4 my-3 rounded-lg"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            )}
            <View className="my-2">
              <Text className="text-gray-600 font-bold">Order Summary</Text>
            </View>
            <View className="flex-row items-center justify-between my-1">
              <Text className="font-semibold text-gray-600">Item total</Text>
              <Text className="font-bold text-lg text-gray-500">
                ${total.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between my-1">
              <Text className="font-semibold text-gray-600">Discount</Text>
              <Text className="font-bold text-lg text-gray-500">$0.00</Text>
            </View>
            <View className="flex-row items-center justify-between my-1">
              <Text className="font-semibold text-gray-600">Tax</Text>
              <Text className="font-bold text-lg text-gray-500">$0.0</Text>
            </View>
            <View className="my-3 flex-row items-center justify-between py-2 border-t border-gray-300">
              <Text className="font-bold text-gray-600">Total</Text>
              <Text className="font-bold text-lg text-gray-500">
                ${total.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-primary p-3 rounded-lg"
              disabled={isLoading || !!merchantId || mutation.isPending}
              onPress={handleSubmit}>
              {isLoading || mutation.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-center font-bold text-white">
                  Process Order
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Gateway;
