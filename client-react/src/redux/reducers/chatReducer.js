const initialState = {
  /*  channels: [
     {
       channelId: "",
       messages: [
         {
           _id: "",
           createdAt: "",
           messageContent: "",
           receiverId: "",
           senderId: {
             _id: "",
             fullName: "",
             avatar: "",
           },
           typeContent: "",
           updatedAt: ""
         }
       ]
     }
   ] */
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MESSAGES':
      // Lặp qua mảng channels để tìm channelId tương ứng với action.payload
      const updatedChannels = state.channels.map(channel => {
        // Nếu channelId của kênh khớp với action.payload
        if (channel.channelId === action.payload.channelId) {
          // Thêm các tin nhắn từ action.payload vào mảng messages của kênh đó
          return {
            ...channel,
            messages: [...channel.messages, ...action.payload.messages]
          };
        }
        // Nếu không khớp, trả về kênh không thay đổi
        return channel;
      });

      // Trả về một phiên bản mới của state với channels đã được cập nhật
      return {
        ...state,
        channels: updatedChannels
      };
    case 'SEND_MESSAGE':
      return {
        ...state,
        message: [...state, action.payload]
      };
    case 'GET_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };

    default:
      return state;
  }
};

export default chatReducer;
