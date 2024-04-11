import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"

const socket = io(SOCKET_URL, {
    extraHeaders: {
        "x-client-id": sessionStorage.getItem('clientId'),
        "authorization": sessionStorage.getItem('refreshToken'),
    },
    withCredentials: true,
});

export default socket;