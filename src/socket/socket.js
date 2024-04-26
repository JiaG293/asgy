
import { serverURL } from "../api/endpointAPI";
import { io } from "socket.io-client";
import { clientId, refreshToken } from "../auth/authStore";

const socket = io (serverURL, {
  extraHeaders: {
      "x-client-id": clientId ,
      "authorization": refreshToken,
  },
  withCredentials: true,
});

export default socket;