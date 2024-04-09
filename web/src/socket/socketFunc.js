// import Cookies from "js-cookie";
// import jwtDecode from "jwt-decode";
// const io = require("socket.io-client");

// const serverUrl = "http://localhost:5000";

// const initializeSocket = () => {
//   const refreshToken = Cookies.get("refreshToken");
//   const clientId = Cookies.get("clientId");
//   if (!refreshToken) {
//     console.log("Refresh token không tồn tại trong cookies");
//     return null;
//   }
//   try {
//     const socket = io(serverUrl, {
//       extraHeaders: {
//         "x-client-id": clientId,
//         authorization: refreshToken,
//       },
//       withCredentials: true,
//     });

//     socket.on("connect", () => {
//       console.log("Connected to server");
//     });

//     socket.on("errorAuthentication", (err) => {
//       console.log(err);
//     });

//     socket.on("disconnect", () => {
//       console.log("Disconnected from server");
//     });

//     return socket;
//   } catch (error) {
//     console.error("Lỗi khi giải mã token:", error);
//     return null;
//   }
// };

// export default initializeSocket;
