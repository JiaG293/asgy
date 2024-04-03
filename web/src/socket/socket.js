const { io } = require('socket.io-client');
const socket = io("http://localhost:5000"); // Corrected URL format

socket.on("connect", () => {
    console.log(socket.id); // Access socket's ID after connection
});



  
//   // client-side
//   socket.on("connect", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
//   });
  
//   socket.on("disconnect", () => {
//     console.log(socket.id); // undefined
//   });