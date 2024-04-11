import { serverURL } from "api/endpointAPI";
import { clientID, refreshToken } from "env/env";
import { io } from "socket.io-client";


const socket = io(serverURL, {
  extraHeaders: {
      "x-client-id": clientID ,
      "authorization": refreshToken,
  },
  withCredentials: true,
});

export default socket;
