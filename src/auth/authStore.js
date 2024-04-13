
// web
// export const refreshToken = sessionStorage.getItem('refreshToken');
// export const clientId = sessionStorage.getItem('clientId');

// mobile

import AsyncStorage from '@react-native-async-storage/async-storage';

export let refreshToken = ''; 
export let clientId = ''; 

const getAsyncStorageData = async () => {
  try {
    refreshToken = await AsyncStorage.getItem('refreshToken') || ''; 
    clientId = await AsyncStorage.getItem('clientId') || ''; 
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
  }
};

getAsyncStorageData(); 

