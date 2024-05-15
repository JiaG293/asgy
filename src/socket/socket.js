import { serverURL } from "../api/endpointAPI";
import { io } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';

async function connectSocket() {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  const clientId = await AsyncStorage.getItem('clientId');

  const socket = io(serverURL, {
    extraHeaders: {
      "x-client-id": clientId,
      "authorization": refreshToken,
    },
    withCredentials: true,
  });

  console.log("Đã kết nối socket");
  return socket;
}

// Sử dụng hàm connectSocket() và gán kết quả vào biến socket
let socket;
connectSocket().then(result => {
  socket = result;
}).catch(error => {
  console.error('Lỗi kết nối socket:', error);
});

export { socket };
