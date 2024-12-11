import React, {createContext, useEffect, useState, useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getString} from '../utils';
import {fetchAllItems, fetchCategories} from '../services';

const ContextApp = createContext(null);

function AppContext({children}) {
  const [cartStore, setCartStore] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [user, setUser] = useState(null);
  const [isBiometricsEnabledContext, setIsBiometricsEnabledContext] =
    useState(null);
  const [items, setItems] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [shouldSync, setShouldSync] = useState(false);

  const {data, isPending, isFetching, refetch} = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      try {
        const response = await fetchAllItems(user?.token);
        return response.data;
      } catch (error) {
        console.error('Error fetching items:', error);
        return [];
      }
    },
    enabled: !!user,
  });

  const {data: categories} = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await fetchCategories(user?.token);
        return response.data;
      } catch (error) {
        console.error('Error fetching items:', error);
        return [];
      }
    },
    enabled: !!user,
  });

  const updateItemsQuantity = (itemId, quantityChange) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === itemId
          ? {
              ...item,
              product: {
                ...item.product,
                quantity: item.product.quantity + quantityChange,
              },
            }
          : item,
      ),
    );
  };

  const addToCart = item => {
    updateItemsQuantity(item.id, -item.quantity);
    const exists = cartStore.find(i => i.id === item.id);
    if (exists) {
      setCartStore(prev =>
        prev.map(i =>
          i.id === item.id ? {...i, quantity: i.quantity + item.quantity} : i,
        ),
      );
    } else {
      setCartStore(prev => [...prev, item]);
    }
  };

  const removeFromCart = item => {
    updateItemsQuantity(item.id, 1);
    setCartStore(prev =>
      item.quantity === 1
        ? prev.filter(i => i.id !== item.id)
        : prev.map(i =>
            i.id === item.id ? {...i, quantity: i.quantity - 1} : i,
          ),
    );
  };

  const removeFromCartStore = () => {
    setCartStore([]);
  };

  const addToCartQty = item => {
    updateItemsQuantity(item.id, -1);
    setCartStore(prev =>
      prev.map(i => (i.id === item.id ? {...i, quantity: i.quantity + 1} : i)),
    );
  };

  const addToWaitlist = item => {
    setCustomerName('');
    setWaitlist(prev => {
      const exists = prev.find(
        w => w.clientName.toLowerCase() === item.clientName.toLowerCase(),
      );
      return exists
        ? prev.map(obj =>
            obj.clientName.toLowerCase() === item.clientName.toLowerCase()
              ? item
              : obj,
          )
        : [...prev, item];
    });
    setCartStore([]);
  };

  const removeFromWaitlist = obj => {
    setWaitlist(prev =>
      prev.filter(
        w => w.clientName.toLowerCase() !== obj.clientName.toLowerCase(),
      ),
    );
  };

  const addMoreItems = (newItems, clientName) => {
    setCartStore(newItems);
    setCustomerName(clientName);
    setWaitlist(prev => prev.filter(w => w.clientName !== clientName));
  };

  useEffect(() => {
    const checkStorage = async () => {
      const existingOrders = await AsyncStorage.getItem('pendingOrders');
      if (existingOrders) {
        setShouldSync(true);
      }
    };
    checkStorage();
  }, []);

  useEffect(() => {
    if (data && items.length === 0 && !shouldRefetch) {
      setItems(data);
    }
  }, [data, items.length, shouldRefetch]);

  useEffect(() => {
    if (shouldRefetch && !isFetching && data) {
      setItems(data);
      setShouldRefetch(false);
    }
  }, [shouldRefetch, isFetching, data]);

  useEffect(() => {
    getString('biometric')
      .then(result => {
        if (result === 'true') {
          setIsBiometricsEnabledContext(true);
        } else if (result === 'false') {
          setIsBiometricsEnabledContext(false);
        } else {
          setIsBiometricsEnabledContext(result);
        }
      })
      .catch(err => console.error('Error fetching biometric setting:', err));
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const contextValue = useMemo(
    () => ({
      cartStore,
      addToCart,
      removeFromCart,
      addToCartQty,
      waitlist,
      addToWaitlist,
      removeFromWaitlist,
      addMoreItems,
      customerName,
      user,
      handleSetUser: setUser,
      isBiometricsEnabledContext,
      setIsBiometricsEnabledContext,
      items,
      isPending,
      isFetching,
      refetch,
      isConnected,
      setShouldRefetch,
      shouldSync,
      setShouldSync,
      removeFromCartStore,
      categories,
    }),
    [
      cartStore,
      waitlist,
      customerName,
      user,
      isBiometricsEnabledContext,
      items,
      isPending,
      isFetching,
      refetch,
      isConnected,
      shouldSync,
    ],
  );

  return (
    <ContextApp.Provider value={contextValue}>{children}</ContextApp.Provider>
  );
}

export const useCartContext = () => React.useContext(ContextApp);

export default AppContext;
