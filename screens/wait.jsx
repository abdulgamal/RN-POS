import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useCartContext} from '../context/AppContext';

const Wait = ({navigation}) => {
  const {waitlist, addMoreItems} = useCartContext();

  const handleAddMoreItems = (arr, clientName) => {
    addMoreItems(arr, clientName);
    navigation.navigate('Home');
  };

  const handlePayment = obj => {
    // router.push({
    //   pathname: './(stack)/gateway',
    //   params: {clientName: obj?.clientName},
    // });
  };
  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <View className="flex-1 p-4">
        <Text className="text-primary text-2xl font-bold">Wait List.</Text>
        {waitlist.length == 0 && (
          <View className="flex-1 justify-center items-center">
            <Text className="text-2xl text-primary font-bold">
              No Customers on the wait list
            </Text>
          </View>
        )}
        <ScrollView>
          {waitlist.map(item => (
            <View
              key={item.clientName}
              className="my-2 bg-white p-2 rounded-lg">
              <View className="flex flex-row items-center justify-between">
                <Text className="mb-1 font-bold">
                  Client Name: {item.clientName}
                </Text>
                <Text className="font-bold">
                  Total Price: ${item.totalPrice.toFixed(2)}
                </Text>
              </View>
              <Text className="mb-1">Products:</Text>
              {item.products.map((product, idx) => (
                <View
                  key={idx}
                  className="flex flex-row items-center gap-2 mb-1">
                  <Text className="font-semibold">{product.name}</Text>
                  <Text>X{product.quantity}</Text>
                </View>
              ))}
              <View className="mt-4 flex flex-row items-center justify-between gap-1">
                <TouchableOpacity
                  className="bg-primary p-2 rounded-lg flex justify-center items-center flex-1"
                  onPress={() =>
                    handleAddMoreItems(item.products, item.clientName)
                  }>
                  <Text className="text-white font-semibold">Add Items</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-primary p-2 rounded-lg flex justify-center items-center flex-1"
                  onPress={() => handlePayment(item)}>
                  <Text className="text-white font-semibold">CheckOut</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Wait;
