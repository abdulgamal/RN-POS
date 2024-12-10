import {View, Text, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {useCartContext} from '../context/AppContext';
import {BASE_URL} from '../services';
import {height} from '../constants';
import {MinusIcon, PlusIcon} from 'react-native-heroicons/outline';

const Details = ({route}) => {
  const {itemId} = route.params;
  const {addToCart, items} = useCartContext();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    if (product?.product.quantity <= 0) {
      Toast.show({
        type: 'error',
        text2: 'Item is out of stock.',
      });
      return;
    }
    if (qty > product?.product.quantity) {
      Toast.show({
        type: 'error',
        text2: 'Your quantity is more than available stock.',
      });
      return;
    }
    const item = {...product.product, quantity: qty};
    addToCart(item);
    setQty(1);
    Toast.show({
      type: 'success',
      text2: 'Item added to cart.',
    });
  };

  const url = product?.product.image
    ? `${BASE_URL}${product.product.image}`
    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq1qC7qPtMAOUR3-ZQsafgfhwmMoyVd5f1hQ&s';

  useEffect(() => {
    const fetchData = () => {
      let result = items.filter(val => val.product.id == itemId);
      setProduct(result[0]);
    };
    fetchData();
  }, [itemId]);

  return (
    <View className="flex-1 bg-secondary">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-3">
          <View style={{height: height * 0.4}}>
            <Image
              source={{
                uri: url,
              }}
              resizeMode="cover"
              className="w-full h-full rounded-lg"
            />
          </View>
          <View className="flex-1 py-3">
            <Text className="font-bold text-xl text-gray-600">
              {product?.product.name}
            </Text>
            <View className="mt-5 flex-row items-center justify-between">
              <Text className="font-semibold text-xl">
                $ {product?.product.sale_price}
              </Text>
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  className="bg-primary flex justify-center items-center rounded-full h-10 w-10"
                  onPress={() => {
                    if (qty !== 1) {
                      setQty(prev => prev - 1);
                    }
                  }}>
                  <MinusIcon size={20} color="white" />
                </TouchableOpacity>
                <Text>{qty}</Text>
                <TouchableOpacity
                  className="bg-primary flex justify-center items-center rounded-full h-10 w-10"
                  onPress={() => setQty(prev => prev + 1)}>
                  <PlusIcon size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            {product?.product.description && (
              <View className="mt-5 border-t border-gray-300 py-3">
                <Text className="font-bold tracking-wider mb-3">
                  Description
                </Text>
                <Text className="text-gray-600 font-semibold">
                  {product?.product.description}
                </Text>
              </View>
            )}
            <View className="w-full mt-5">
              <TouchableOpacity
                className="flex items-center justify-center bg-primary p-5 rounded-full"
                onPress={handleAddToCart}>
                <Text className="text-white font-semibold">
                  Add {qty} for ${product?.product.sale_price * qty}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Details;
