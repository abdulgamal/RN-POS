import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {BASE_URL} from '../services';
import {useCartContext} from '../context/AppContext';
import {MinusIcon, PlusIcon} from 'react-native-heroicons/outline';

const Paper = ({item}) => {
  const {removeFromCart, addToCartQty} = useCartContext();
  const url = item.image
    ? `${BASE_URL}${item.image}`
    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq1qC7qPtMAOUR3-ZQsafgfhwmMoyVd5f1hQ&s';

  return (
    <View className="flex-row items-center justify-between gap-3 mb-3 border-b border-gray-200 p-4 shadow">
      <Image
        source={{
          uri: url,
        }}
        className="w-16 h-16 rounded-lg"
      />
      <View className="flex-1 flex-row items-center justify-between">
        <View>
          <Text numberOfLines={1} className="font-semibold mb-2">
            {item?.name}
          </Text>
          <Text>${item?.sale_price}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => removeFromCart(item)}
            className="bg-primary flex justify-center items-center rounded-full h-10 w-10">
            <MinusIcon size={16} color="white" />
          </TouchableOpacity>
          <Text>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => addToCartQty(item)}
            className="bg-primary flex justify-center items-center rounded-full h-10 w-10">
            <PlusIcon size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Paper;
