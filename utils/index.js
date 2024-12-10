import AsyncStorage from '@react-native-async-storage/async-storage';

export const setString = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

export const getString = async key => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.log(e);
  }
};

export const removeItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};
