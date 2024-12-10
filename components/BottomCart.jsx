import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useCartContext} from '../context/AppContext';
import {useNavigation} from '@react-navigation/native';
import {ChevronRightIcon} from 'react-native-heroicons/outline';

const BottomCart = () => {
  const navigation = useNavigation();
  const {cartStore} = useCartContext();
  const total = cartStore?.reduce(
    (acc, curr) => acc + curr.sale_price * curr.quantity,
    0,
  );
  return (
    <View className="flex-row items-center justify-between bg-tertiary px-4 py-3 bottom-10 absolute right-3 left-3 rounded-lg">
      <View>
        <Text className="text-white font-semibold">
          {cartStore.length == 1
            ? '1 item selected'
            : `${cartStore.length} items selected`}
        </Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
        <View className="bg-primary px-2 py-2 rounded-lg flex-row items-center gap-2">
          <Text className="text-white font-semibold">${total.toFixed(2)}</Text>
          <ChevronRightIcon size={18} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BottomCart;
