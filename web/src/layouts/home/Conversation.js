import React, { useEffect, useState } from "react";
import "../homeStyle/Conversation.scss";
import Header from "./Header";
import { FiSend as SendIcon } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import socket from "socket/socket";
import { setMessages } from "../../redux/action";

function Conversation() {
  const profile = useSelector((state) => state.profile); // Lấy thông tin hồ sơ từ Redux store
  const profileID = profile?._id; // Lấy ID của người dùng hiện tại
  const [messageContent, setMessageContent] = useState(""); // State lưu nội dung tin nhắn mới
  const currentChannel = useSelector((state) => state.currentChannel); // Lấy kênh hiện tại từ Redux store
  const dispatch = useDispatch(); // Sử dụng useDispatch hook để gửi action đến Redux store
  const currentMessages = useSelector((state) => state.currentMessages); // Lấy danh sách tin nhắn hiện tại từ Redux store
  const [profileUpdated, setProfileUpdated] = useState(false);

  // Render danh sách tin nhắn
  const message = currentMessages.map((message) => (
    <div
      key={message?._id}
      className={
        message.senderId._id === profileID
          ? "conversation-item-me"
          : "conversation-item-you"
      }
    >
      <div className="message-content">{message?.messageContent}</div>
    </div>
  ));

  // Xử lý sự kiện nhấn phím Enter để gửi tin nhắn
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      IOSendMessage();
    }
  }

  // Lắng nghe thay đổi trong danh sách tin nhắn và thực hiện các hành động cần thiết
  useEffect(() => {
    socket.on("getMessage", (newMessage) => {
      console.log("Nhận về từ server",newMessage);
      dispatch(setMessages([...currentMessages, newMessage]));
    });

    return () => {
      socket.off("getMessage");
    };
  }, [currentMessages]); 

  // Gửi tin nhắn từ máy khách tới máy chủ
  const IOSendMessage = () => {
    // Kiểm tra xem đã có đủ thông tin để gửi tin nhắn chưa
    if (profile && currentChannel && messageContent) {
      socket.emit("sendMessage", {
        senderId: profile._id,
        receiverId: currentChannel._id,
        typeContent: "text",
        messageContent: messageContent,
      });
      setMessageContent("");
    }
  };

  const IOloadMessages = (senderId) => {
    socket.emit("loadMessages", {
      senderId: senderId,
    });
  };

  if (profile?._id && !profileUpdated) {
    IOloadMessages(profile._id);
    setProfileUpdated(true);
  }

  return (
    <div className="conversation-container">
      <Header />
      <div className="conversation-messages">{message}</div>
      <div className="conversation-input-container">
        <div className="conversation-input-with-button">
          <input
            className="conversation-input"
            type="text"
            placeholder="Nhập tin nhắn của bạn..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyPress={handleKeyPress} // Xử lý sự kiện nhấn phím Enter
          />
          <button className="conversation-button" onClick={IOSendMessage}>
            <span style={{ marginRight: 10 }}>Gửi</span>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
