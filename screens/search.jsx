import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import useDebounce from '../hooks/useDebounce';
import {useCartContext} from '../context/AppContext';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import CardItem from '../components/CardItem';

const Search = () => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDebounce(search, 500);
  const [filteredItems, setFilteredItems] = useState([]);
  const searchInputRef = useRef(null);
  const {items} = useCartContext();

  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  useEffect(() => {
    const searchItems = () => {
      if (!deferredSearch) return setFilteredItems([]);
      let result = items.filter(item =>
        item.product.name.toLowerCase().includes(deferredSearch.toLowerCase()),
      );
      setFilteredItems(result);
    };
    searchItems();
  }, [deferredSearch]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-3">
        <View className="my-5 bg-white p-4 rounded-full flex flex-row items-center">
          <MagnifyingGlassIcon size={24} color={'#333'} />
          <TextInput
            placeholder="Search"
            className="ml-2 border-b border-b-secondary p-1 flex-1"
            value={search}
            onChangeText={setSearch}
            ref={searchInputRef}
            placeholderTextColor={'gray'}
          />
        </View>
        <View className="mt-3 flex-1">
          <FlatList
            data={filteredItems}
            renderItem={({item}) => <CardItem item={item} />}
            keyExtractor={item => item.product.id}
            numColumns={2}
            contentContainerClassName="gap-5"
            columnWrapperStyle={{justifyContent: 'space-between'}}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center bg-secondary shadow p-4 rounded-lg">
                <Text className="text-primary font-semibold text-xl">
                  Search for Items.
                </Text>
                {/* <Image
                  source={require('../../assets/images/search.png')}
                  resizeMode="cover"
                  className="w-40 h-40 mt-3"
                /> */}
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Search;
