import Cookies from "js-cookie";
import { serverURL } from "../api/endpointAPI";
import { io } from "socket.io-client";

 const refreshToken = Cookies.get("refreshToken");

 const clientID = Cookies.get("clientId")

const socket = io (serverURL, {
  extraHeaders: {
      "x-client-id": clientID ,
      "authorization": refreshToken,
  },
  withCredentials: true,
});

export default socket;
