import axios from 'axios';

export const BASE_URL = 'https://demo.paysokoerp.com/';
export const loginUser = async (email, password) => {
  const response = await axios.post(
    `${BASE_URL}api/pos/login`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const fetchAllItems = async token => {
  const response = await axios.get(`${BASE_URL}api/Pos/search-products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const setActiveWorkspace = async (token, workspaceId) => {
  const response = await axios.get(
    `${BASE_URL}api/Pos/set-active-workspace/${workspaceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const makeOrder = async (token, data) => {
  const response = await axios.post(`${BASE_URL}api/Pos/make-order`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const sendSTKPush = async (phone, amount = 2) => {
  const response = await axios.post(`${BASE_URL}api/pos/send-stk`, {
    phone_number: phone,
    amount,
    merchant_email: 'wangara88@gmail.com',
    description: 'M-Pesa Payment',
  });
  return response.data;
};
