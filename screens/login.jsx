import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useCartContext} from '../context/AppContext';
import {loginUser} from '../services';
import {getString, setString} from '../utils';
import LocalAuthentication from 'rn-local-authentication';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('demo@paysokosystems.com');
  const [password, setPassword] = useState('SokoPay@dmin99');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const {
    handleSetUser,
    setIsBiometricsEnabledContext,
    isBiometricsEnabledContext,
    user,
  } = useCartContext();

  const loginWithCredentials = async () => {
    if (!email || !password) {
      Alert.alert('Please enter email and password');
      return;
    }
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await loginUser(email, password);
      if (response?.data) {
        handleSetUser(response.data);
        await setString('logs', JSON.stringify({email, password}));
        if (isBiometricsEnabledContext == null) {
          Alert.alert('Do You want to use Biometrics for Login?', '', [
            {
              text: 'No',
              onPress: async () => {
                await setString('biometric', 'false');
                navigation.navigate('Home');
              },
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                await setString('biometric', 'true');
                setIsBiometricsEnabledContext(true);
                navigation.navigate('Home');
              },
            },
          ]);
        } else {
          navigation.navigate('Home');
        }
      }
    } catch (error) {
      console.log('Login failed', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async (eml, pwd) => {
    setIsLoading(true);
    try {
      const response = await loginUser(eml, pwd);
      handleSetUser(response.data);
      navigation.navigate('Home');
    } catch (error) {
      console.log('Fetch user error', error);
      Alert.alert(
        'Biometric authentication failed',
        'Please Login with email and password',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    const hasBiometrics = await LocalAuthentication.isAvailableAsync();
    if (!hasBiometrics) {
      Alert.alert(
        'No Biometrics found',
        'Please use your password or set biometrics on your device first.',
      );
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      reason: 'Authenticate to access the app',
      fallbackToPasscode: true,
      suppressEnterPassword: false,
    });

    if (result.success) {
      const creds = await getString('logs');
      if (creds) {
        const {email, password} = JSON.parse(creds);
        fetchUserData(email, password);
      } else {
        Alert.alert(
          'Biometric authentication failed',
          'Please Login with email and password',
        );
      }
    } else {
      Alert.alert(
        'Biometric authentication failed',
        'Please Login with email and password',
      );
    }
  };

  const checkBiometricSupport = async () => {
    const supported = await LocalAuthentication.isSupportedAsync();
    setIsBiometricSupported(supported);
  };

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  useEffect(() => {
    if (isBiometricSupported && isBiometricsEnabledContext && !user) {
      handleBiometricAuth();
    }
  }, [isBiometricSupported, isBiometricsEnabledContext, user]);

  const handlePress = () => {
    loginWithCredentials();
  };
  return (
    <View className="flex-1 bg-primary">
      <View className="flex-1 w-full p-5 items-center justify-evenly">
        <View>
          <Text className="text-4xl text-secondary font-bold tracking-wider">
            Good day!
          </Text>
          <Text className="text-3xl font-semibold text-secondary mt-2">
            Please, log in.
          </Text>
        </View>
        <View className="w-full">
          <TextInput
            className="border border-secondary w-full p-5 rounded-lg text-secondary"
            placeholder="Enter Email..."
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={'#f6f6f6'}
          />
          <TextInput
            className="border border-secondary w-full p-5 rounded-lg my-7 text-secondary"
            placeholder="Enter Password..."
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={'#f6f6f6'}
          />
        </View>
        {isError && (
          <Text className="font-bold text-red-400">Invalid Credentials</Text>
        )}
        <TouchableOpacity
          className="bg-secondary w-full p-4 flex justify-center items-center rounded-xl"
          onPress={handlePress}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Text className="font-bold">Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
