import axios from "axios";

const io = require("socket.io-client");

const serverUrl = "http://localhost:5000";
const socket = io(serverUrl, {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("getMessage", (data) => {
  console.log("Message from server:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

export const IOsendMessage = (
  senderId,
  receiverId, // ở đây là channel Id
  typeContent,
  messageContent
) => {
  socket.emit("sendMessage", {
    senderId,
    receiverId,
    typeContent,
    messageContent,
  });
};

// export const fetchData = async (refreshToken, clientID) => {
//   try {
//     const headers = {
//       "x-client-id": clientID,
//       "authorization": refreshToken,
//     };
//     const response = await axios.get(
//       "http://localhost:5000/api/v1/chats/channels",
//       {
//         headers,
//       }
//     );
//     if (response.status === 200) {
//       const channelList = response.data.metadata.listChannels;
//       return channelList;
//     } else {
//       console.error("Lỗi khi lấy thông tin người dùng");
//     }
//   } catch (error) {
//     console.error("Lỗi khi lấy thông tin người dùng:", error);
//   }
// };

// export const IOaddChannel = async (
//   senderId,
//   refreshToken,
//   clientID,
//   receiverId,
//   fetchData
// ) => {
//   try {
//     const channels = await fetchData(refreshToken, clientID);
//     if (channels && channels.length > 0) {
//       channels.forEach((channel) => {
//         socket.emit("addChannel", {
//           senderId,
//           channelId: channel._id,
//           receiverId,
//         });
//       });
//     } else {
//       console.error("No channels found.");
//     }
//   } catch (error) {
//     console.error("Error adding channel:", error);
//   }
// };

export const IOloadChannels = (userId) => {
  socket.emit("loadChannels", userId);
};

export const IOaddUser = (userId, channels) => {
  socket.emit("addUser", { userId, channels });
};

export const IOloadMessages = (senderId) => {
  socket.emit("loadMessages", {
    senderId: senderId,
  });
};

export const IOgetListMessages = (channelId, messagesStorage) => {
  socket.off("getMessages");
  messagesStorage.splice(0, messagesStorage.length);
  const messageHandler = (data) => {
    data.messages.forEach((message) => {
      const {
        senderId,
        messageContent,
        receiverId,
        createdAt,
        updatedAt,
        _id,
      } = message;
      if (receiverId === channelId) {
        console.log(`Message ID: ${_id}`);
        console.log(`Sender ID: ${senderId._id}`);
        console.log(`Receiver ID: ${receiverId}`);
        console.log(`Message Content: ${messageContent}`);
        console.log(`Created At: ${createdAt}`);
        console.log(`Updated At: ${updatedAt}`);
        console.log("-------------------");
        messagesStorage.push(message);
      }
    });
  };
  socket.on("getMessages", messageHandler);
};

// // chạy npm run socket để test nhớ xóa
// async function run() {
//   const senderId = "660bff9373d47c8fb7682b9c";
//   const clientID = "660e428cb09c0ae1561f39cc";
//   const refreshToken =
//     "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjY2MGU0MjhjYjA5YzBhZTE1NjFmMzljYyIsInVzZXJJZCI6IjY2MGJmZjkzNzNkNDdjOGZiNzY4MmI5YiIsInByb2ZpbGVJZCI6IjY2MGJmZjkzNzNkNDdjOGZiNzY4MmI5YyIsImlhdCI6MTcxMjIxMDU3MiwiZXhwIjoxNzEyODE1MzcyfQ.0IZadEc5kko_c--Omh7TpPe4UvDHV12Ypnpzsj_7uTmk315DDhbtE4-Fn0cFsKhv9SC0_CBUshUd-xB-AwVyCmuzox569xHlGsAncx9MyOWw_sXuPk3jqTuFdkCRf8tW5AgB87Txz_Wt0YyL14emOWDVJvpzrxfrDfsC-Aw5wTX00Rv8PMPFsNumeUmHnpN85MzilgGP1U_oFJSUtr8uNI7ByOo5MaoOpkbPS2fqdu34Z3X3RvV7zc9taXGcjWzYshF3LkHwLuCII04kNmFnUOVdQMXB8MZR6Czzfy1Q7Iucmq0pKb1OSGDH66tkfav2SM139jYBP8204AQG9ou0R93n368GxnUYR2AUJsGN8-zFEWjnqJj4lXIXs5ZjnveMc0Q0fLsaJxgb0xu9habDFaE0cPeGUZBEQHaO871SgMqyznNvH3VML_UmoSR_nWIOOBn1cIbytxGMvH3v9q2gXd5Lsq75I5_r-8QrvtIvAHIW2_a-VGF4oPfUFcpfWm5oIvGcnPHT89mdSA3JzsA86dX1_EdjxUIdVHG6SIrs9T5By1NaBPJOgDMDporzsq7qA7h1EMXVJXStK873V9K4Fg3YmTSXntT6fjgzSC4HfN_A6r-teDHZ8Oephp0-7hwLs3O80-mFl8tkP8wR3r1F0yE3TAQH_-o-aTlMU4Rjuls";
//   const receiverId = "660c0a13f0c81e0801b4e9fd";
//   const channelId = ["65f421456957be1099c49d5f"];
//   const typeContent = "text";
//   const messageContent = "Hello from asgy";

//   await IOaddChannel(senderId, refreshToken, clientID, receiverId);
//   IOaddUser(senderId, channelId);
//   IOsendMessage(senderId, channelId, typeContent, messageContent);
//   console.log("=================LOAD====================");
//   IOloadChannels(senderId);
// }