import {View, Text, Image} from 'react-native';
import React from 'react';
import {BASE_URL} from '../services';

const PayoutCard = ({item}) => {
  const url = item.image
    ? `${BASE_URL}${item.image}`
    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq1qC7qPtMAOUR3-ZQsafgfhwmMoyVd5f1hQ&s';

  return (
    <View className="flex-row items-center justify-between gap-3 mb-3 border-b border-gray-200 p-4 shadow">
      <View className="h-10 w-10 justify-center items-center rounded-full border-2 border-primary">
        <Text className="text-xs font-semibold">X{item.quantity}</Text>
      </View>
      <View className="flex-1 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Image
            source={{
              uri: url,
            }}
            className="w-16 h-16 rounded-lg"
          />
          <View>
            <Text numberOfLines={1} className="font-semibold mb-2">
              {item.name}
            </Text>
            <Text>{item.category_name}</Text>
          </View>
        </View>
        <Text className="font-bold text-xl text-gray-600">
          ${item.sale_price * item.quantity}
        </Text>
      </View>
    </View>
  );
};

export default PayoutCard;
