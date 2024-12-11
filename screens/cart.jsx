import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import {useCartContext} from '../context/AppContext';
import Paper from '../components/Paper';

const Cart = ({navigation}) => {
  const {cartStore} = useCartContext();
  const total = cartStore?.reduce(
    (acc, curr) => acc + curr.sale_price * curr.quantity,
    0,
  );
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
            <TouchableOpacity
              className="bg-primary px-3 py-5 rounded-lg justify-center items-center"
              onPress={() => navigation.navigate('Gateway')}
              disabled={cartStore.length == 0}>
              <Text className="text-white font-bold">
                Check Out | ${total.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Cart;
