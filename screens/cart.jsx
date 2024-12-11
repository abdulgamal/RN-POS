import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect} from 'react';
import {useCartContext} from '../context/AppContext';
import Paper from '../components/Paper';
import Toast from 'react-native-toast-message';

const Cart = ({navigation}) => {
  const [clientName, setClientName] = React.useState('');
  const {cartStore, customerName, addToWaitlist} = useCartContext();
  const total = cartStore?.reduce(
    (acc, curr) => acc + curr.sale_price * curr.quantity,
    0,
  );

  const handleOrder = () => {
    if (!clientName) {
      Toast.show({
        type: 'error',
        text2: 'Please enter your client name.',
      });
      return;
    }
    const item = {
      clientName: clientName,
      products: cartStore,
      totalPrice: total,
    };

    addToWaitlist(item);
    navigation.navigate('Wait');
    setClientName('');
    Toast.show({
      type: 'success',
      text2: 'Items added successfully to waitlist.',
    });
  };

  useEffect(() => {
    setClientName(customerName);
  }, [customerName]);

  return (
    <View className="bg-secondary flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-3 mt-4">
          <Text className="font-bold text-2xl">Ordered Items</Text>
          <View className="mt-4 flex-1">
            <FlatList
              data={cartStore}
              renderItem={({item}) => <Paper item={item} />}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View className="flex-1 justify-center items-center bg-secondary shadow p-4 rounded-lg">
                  <Text className="text-primary font-semibold text-xl">
                    No Items in the cart
                  </Text>
                  <Image
                    source={require('../assets/images/cart.png')}
                    resizeMode="cover"
                    className="w-40 h-40 mt-3"
                  />
                </View>
              )}
            />
          </View>
          <View className="py-5">
            <View className="my-2">
              <TextInput
                placeholder="Client name..."
                className="border p-3 rounded-lg border-gray-400"
                value={clientName}
                onChangeText={setClientName}
              />
            </View>
            <TouchableOpacity
              className="bg-primary px-3 py-5 rounded-lg justify-center items-center"
              onPress={handleOrder}
              disabled={cartStore.length == 0}>
              <Text className="text-white font-bold">
                Add to waitlist | ${total.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Cart;
