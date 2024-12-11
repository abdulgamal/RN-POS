import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {UserIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {useCartContext} from '../context/AppContext';
import {BASE_URL} from '../services';
import {height} from '../constants';
import CardItem from '../components/CardItem';

const Home = ({navigation}) => {
  const {items, isPending, isFetching, shouldSync, categories} =
    useCartContext();

  const url =
    `${BASE_URL}${items?.[0]?.product?.image}` ||
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq1qC7qPtMAOUR3-ZQsafgfhwmMoyVd5f1hQ&s';

  // console.log('cats', categories);
  return (
    <View className="flex-1 bg-secondary relative">
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between mt-5 px-3">
          <TouchableOpacity
            className="w-12 h-12 bg-white justify-center items-center rounded-full"
            onPress={() => {
              navigation.navigate('Profile');
            }}>
            <UserIcon />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-12 h-12 bg-white justify-center items-center rounded-full"
            onPress={() => {
              navigation.navigate('Search');
            }}>
            <MagnifyingGlassIcon />
          </TouchableOpacity>
        </View>
        {items?.length > 0 && (
          <View
            style={{height: height * 0.2}}
            className="bg-primary p-3 rounded-xl my-3 mx-3 flex-row items-center justify-between gap-5">
            <View>
              <Text className="text-white text-2xl font-semibold mb-2">
                BEST OFFER
              </Text>
              <Text className="text-gray-200 font-semibold">
                Discount up to 70%
              </Text>
            </View>
            <View className="flex-1">
              <Image
                source={{uri: url}}
                resizeMode="cover"
                className="h-full w-full rounded-full"
              />
            </View>
          </View>
        )}
        <View className="flex-1 px-3 pt-2 mt-2">
          {shouldSync ? (
            <View className="flex-1 justify-center items-center">
              <View className="bg-white shadow-lg rounded-lg p-4 justify-center items-center">
                <Text className="text-primary font-semibold text-xl text-center">
                  Sync Your orders first
                </Text>
                <TouchableOpacity
                  className="bg-secondary px-4 py-3 rounded-full w-24 justify-center items-center mt-2"
                  onPress={() => {
                    navigation.navigate('Profile');
                  }}>
                  <Text className="font-bold">Sync</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : isFetching || isPending ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color={'#333'} />
            </View>
          ) : (
            <FlatList
              data={items}
              renderItem={({item}) => <CardItem item={item} />}
              keyExtractor={item => item.product.id}
              numColumns={2}
              contentContainerClassName="gap-5"
              columnWrapperStyle={{justifyContent: 'space-between'}}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View className="flex-1 justify-center items-center bg-secondary shadow p-4 rounded-lg">
                  <Text className="text-primary font-semibold text-xl">
                    No Items in this workspace
                  </Text>
                  <Image
                    source={require('../assets/images/cart.png')}
                    resizeMode="cover"
                    className="w-40 h-40 mt-3"
                  />
                </View>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Home;
