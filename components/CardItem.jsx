import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useCartContext} from '../context/AppContext';
import {BASE_URL} from '../services';
import {width} from '../constants';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {PlusIcon} from 'react-native-heroicons/outline';

const CardItem = ({item}) => {
  const {addToCart} = useCartContext();
  const navigation = useNavigation();
  const url = item.product.image
    ? `${BASE_URL}${item.product.image}`
    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq1qC7qPtMAOUR3-ZQsafgfhwmMoyVd5f1hQ&s';

  return (
    <View className="bg-white rounded-xl shadow" style={{width: width * 0.45}}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Details', {itemId: item.product.id});
        }}>
        <View className="p-3 justify-center items-center gap-1">
          <Image
            source={{
              uri: url,
            }}
            resizeMode="cover"
            className="w-full h-36 rounded-lg"
          />
          <Text className="font-bold text-lg" numberOfLines={1}>
            {item?.product.name}
          </Text>
          <Text className="font-semibold text-gray-500">
            {item.product.category_name}
          </Text>
        </View>
      </TouchableOpacity>
      <View className="flex-row items-center justify-between p-2 bg-secondary m-2 rounded-lg">
        <Text className="font-semibold">${item.product.sale_price}</Text>
        <Text className="font-semibold text-xs">
          Qty: {item.product.quantity}
        </Text>
        <TouchableOpacity
          className="w-10 h-10 bg-primary justify-center items-center rounded-full"
          onPress={() => {
            if (item.product.quantity == 0) {
              Toast.show({
                type: 'error',
                text2: 'Item is out of stock.',
              });
              return;
            }
            addToCart({...item.product, quantity: 1});
          }}>
          <PlusIcon color="white" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CardItem;
