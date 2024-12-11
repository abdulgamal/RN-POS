import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useCartContext} from '../context/AppContext';
import {useMutation} from '@tanstack/react-query';
import {setActiveWorkspace} from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HomeIcon} from 'react-native-heroicons/outline';
import Toast from 'react-native-toast-message';

const DropDownSelect = () => {
  const {user, refetch, isConnected, setShouldRefetch} = useCartContext();
  const items = user?.workspaces;
  const [value, setValue] = useState(null);

  const mutation = useMutation({
    mutationFn: ({id, tk}) => setActiveWorkspace(tk, id),
    onSuccess: () => {
      refetch();
      setShouldRefetch(true);
      Toast.show({
        type: 'success',
        text2: 'Workspace changed successfully',
      });
      return;
    },
    onError: error => {
      console.log(' error', error);
    },
  });

  const handleChange = async item => {
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text2: 'You are offline, please connect to the internet',
      });
      return;
    }
    const existingOrders = await AsyncStorage.getItem('pendingOrders');
    if (existingOrders) {
      Toast.show({
        type: 'error',
        text2: 'You have pending orders. Sync with the DB first',
      });
      return;
    }
    setValue(item.name);
    mutation.mutate({id: item.id, tk: user?.token});
  };

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={items}
      //   search
      maxHeight={250}
      labelField="name"
      valueField="name"
      placeholder="Select WorkSpace"
      //   searchPlaceholder="Search..."
      value={value}
      onChange={item => {
        handleChange(item);
      }}
      renderLeftIcon={() => (
        <HomeIcon style={styles.icon} color="black" size={20} />
      )}
    />
  );
};

export default DropDownSelect;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    flex: 1,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
